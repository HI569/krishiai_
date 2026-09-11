from fastapi import APIRouter, UploadFile, File, HTTPException
from PIL import Image
import httpx
import os
import base64
import io
from pathlib import Path
from dotenv import load_dotenv

# Load .env from the backend folder
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

router = APIRouter()

PLANT_ID_API_KEY = os.getenv("PLANT_ID_API_KEY", "")
PLANT_ID_API_URL = os.getenv(
    "PLANT_ID_API_URL",
    "https://plant.id/api/v3"
).rstrip("/")

DISEASE_INFO = {
    "healthy": {
        "status": "Healthy Plant",
        "symptoms": [
            "No major disease symptoms detected.",
            "Plant appears healthy."
        ],
        "actions": [
            "Continue regular crop monitoring.",
            "Maintain proper irrigation.",
            "Maintain balanced nutrition.",
            "Monitor for new symptoms."
        ]
    }
}


def get_disease_info(disease: str):
    disease_lower = disease.lower()

    if "healthy" in disease_lower:
        return DISEASE_INFO["healthy"]

    return {
        "status": "Possible Disease Detected",
        "symptoms": [
            f"Possible {disease} detected.",
            "Visible symptoms may vary depending on crop and severity."
        ],
        "actions": [
            "Remove or isolate severely affected plant material.",
            "Improve air circulation around the plant.",
            "Avoid unnecessary overhead irrigation.",
            "Monitor nearby plants for similar symptoms.",
            "Consult a local agricultural expert for confirmation."
        ]
    }


@router.post("/predict")
async def predict(file: UploadFile = File(...)):

    if not file.content_type:
        raise HTTPException(
            status_code=400,
            detail="File type could not be determined."
        )

    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="Please upload a valid plant image."
        )

    if not PLANT_ID_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="Plant.id API key is not configured."
        )

    try:
        image_bytes = await file.read()

        if not image_bytes:
            raise HTTPException(
                status_code=400,
                detail="Uploaded image is empty."
            )

        # Validate that the uploaded file is actually an image.
        image = Image.open(io.BytesIO(image_bytes))
        image.verify()

        image_base64 = base64.b64encode(image_bytes).decode("utf-8")

        # Payload without 'similar_images: False'
        payload = {
            "images": [
                f"data:{file.content_type};base64,{image_base64}"
            ],
            "health": "all",
            "symptoms": True
        }

        headers = {
            "Api-Key": PLANT_ID_API_KEY,
            "Content-Type": "application/json"
        }

        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                f"{PLANT_ID_API_URL}/identification",
                headers=headers,
                json=payload
            )

        if response.status_code >= 400:
            raise HTTPException(
                status_code=response.status_code,
                detail=f"Plant.id API error: {response.text}"
            )

        data = response.json()

        # ----------------------------------------------------
        # Extract plant identification
        # ----------------------------------------------------
        suggestions = data.get("result", {}).get("classification", {}).get(
            "suggestions", []
        )

        plant_name = "Unknown plant"
        plant_probability = 0.0

        if suggestions:
            best = suggestions[0]
            plant_name = best.get("name", "Unknown plant")
            plant_probability = float(
                best.get("probability", 0)
            ) * 100

        # ----------------------------------------------------
        # Extract health assessment
        # ----------------------------------------------------
        health_result = data.get("result", {}).get(
            "disease", {}
        )

        disease_suggestions = health_result.get(
            "suggestions", []
        )

        disease_name = "No disease detected"
        disease_probability = 0.0

        if disease_suggestions:
            best_disease = disease_suggestions[0]

            disease_name = best_disease.get(
                "name",
                "Unknown condition"
            )

            disease_probability = float(
                best_disease.get("probability", 0)
            ) * 100

        # ----------------------------------------------------
        # Determine status
        # ----------------------------------------------------
        if disease_name.lower() == "no disease detected":
            status = "Healthy Plant"

            symptoms = [
                "No significant disease detected.",
                "The plant appears healthy based on the image."
            ]

            actions = [
                "Continue regular crop monitoring.",
                "Maintain proper irrigation.",
                "Maintain balanced nutrition.",
                "Monitor for any new symptoms."
            ]

        elif disease_probability < 10:
            status = "Healthy Plant"

            symptoms = [
                "No significant disease detected.",
                f"Minor indication of {disease_name} was detected."
            ]

            actions = [
                "Continue monitoring the plant.",
                "Maintain proper irrigation and nutrition.",
                "Check nearby plants for similar symptoms."
            ]

        else:
            status = "Possible Disease Detected"

            info = get_disease_info(disease_name)

            symptoms = info["symptoms"]
            actions = info["actions"]

        return {
            "status": status,
            "filename": file.filename,

            "plant": plant_name,
            "plant_confidence": round(
                plant_probability,
                2
            ),

            "disease": disease_name,
            "confidence": round(
                disease_probability,
                2
            ),

            "symptoms": symptoms,
            "actions": actions,
            "solution": actions,

            "model": "Plant.id API",
            "model_connected": True
        }

    except HTTPException:
        raise

    except Exception as e:
        print(
            "Plant.id disease prediction error:",
            e
        )

        raise HTTPException(
            status_code=500,
            detail=f"Plant analysis failed: {str(e)}"
        )


@router.get("/status")
def model_status():
    return {
        "model_connected": bool(PLANT_ID_API_KEY),
        "model": "Plant.id API"
    }