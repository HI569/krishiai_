from fastapi import APIRouter, UploadFile, File, HTTPException
from PIL import Image
import os
import base64
import io
from pathlib import Path
from dotenv import load_dotenv

# Load .env from the backend folder
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

router = APIRouter()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-flash-lite-latest")


def _analyze_with_gemini(image_bytes: bytes, content_type: str) -> dict:
    """
    Use Gemini Vision to detect plant diseases with strict Non-Plant / Human gatekeeping.
    Falls back to a safe offline result if the API is unavailable.
    """
    import httpx, json

    if not GEMINI_API_KEY:
        return _offline_result("Gemini API key not configured")

    image_b64 = base64.b64encode(image_bytes).decode("utf-8")
    mime_type = content_type if content_type.startswith("image/") else "image/jpeg"

    prompt = """You are a strict agricultural AI vision inspector and plant pathologist.

YOUR FIRST CRITICAL TASK: Verify whether the uploaded photograph contains a plant leaf, crop, fruit, vegetable, flower, tree foliage, or agricultural plant specimen.

CHECK FOR NON-PLANT SUBJECTS:
- If the image contains a HUMAN (face, selfie, person, human body/skin/hands, portrait, clothing),
- Or an ANIMAL (dog, cat, cow, bird, pet, insect not on a leaf),
- Or an INANIMATE OBJECT (vehicle, car, phone, computer, furniture, indoor room, wall, road, appliance, document, screenshot, meme, drawing),
- Or anything that is NOT primarily a real plant/crop/leaf,
YOU MUST REJECT IT IMMEDIATELY with this exact JSON format:
{
  "is_plant": false,
  "detected_subject": "<brief description of what is actually shown, e.g. 'Human Person / Face', 'Animal / Dog', 'Indoor Room', 'Car / Vehicle', 'Electronic Device'>",
  "error_message": "Non-plant image detected (<detected_subject>). Please upload a clear photo of a crop leaf or plant.",
  "plant_name": "Not a Plant",
  "plant_confidence": 0,
  "disease_name": "N/A",
  "disease_confidence": 0,
  "status": "Non-Plant Detected",
  "symptoms": [],
  "organic_treatment": [],
  "chemical_treatment": [],
  "severity": "None",
  "prevention": ["Please upload a clear photo of a plant leaf or crop for health diagnosis."]
}

ONLY IF THE IMAGE IS GENUINELY A PLANT LEAF OR AGRICULTURAL CROP:
Respond with this exact JSON format:
{
  "is_plant": true,
  "detected_subject": "<scientific or common plant name>",
  "plant_name": "<scientific or common plant name>",
  "plant_confidence": <0-100 number>,
  "disease_name": "<specific disease name, e.g. 'Tomato Early Blight', 'Rice Blast', or 'Healthy - No disease detected'>",
  "disease_confidence": <0-100 number>,
  "status": "<'Healthy Plant' or 'Disease Detected'>",
  "symptoms": ["<symptom 1>", "<symptom 2>", "<symptom 3>"],
  "organic_treatment": ["<organic remedy 1>", "<organic remedy 2>", "<organic remedy 3>"],
  "chemical_treatment": ["<chemical remedy 1>", "<chemical remedy 2>", "<chemical remedy 3>"],
  "severity": "<'Low' or 'Moderate' or 'High' or 'None'>",
  "prevention": ["<prevention tip 1>", "<prevention tip 2>"]
}

Strict Rules:
- NEVER diagnose a human or non-plant image as a plant disease.
- If plant is healthy, set disease_name to 'Healthy - No disease detected', status to 'Healthy Plant', disease_confidence to 0, severity to 'None'.
- For diseases, provide actionable Indian agricultural remedies with practical dosages.
- Output ONLY valid JSON, no markdown codeblocks, no text outside JSON."""

    payload = {
        "contents": [{
            "parts": [
                {
                    "inline_data": {
                        "mime_type": mime_type,
                        "data": image_b64
                    }
                },
                {"text": prompt}
            ]
        }],
        "generationConfig": {
            "temperature": 0.1,
            "maxOutputTokens": 1024,
            "responseMimeType": "application/json"
        }
    }

    # Try models in order — same ones that work for AI chat
    models = list(dict.fromkeys([
        GEMINI_MODEL,
        "gemini-flash-lite-latest",
        "gemini-3.1-flash-lite",
        "gemini-3.7-flash",
        "gemini-3.1-flash-lite-preview",
    ]))

    for model in models:
        try:
            url = (
                f"https://generativelanguage.googleapis.com/v1beta/models/"
                f"{model}:generateContent?key={GEMINI_API_KEY}"
            )
            with httpx.Client(timeout=20.0) as client:
                res = client.post(url, json=payload)

            if res.status_code != 200:
                continue

            data = res.json()
            text = (
                data.get("candidates", [{}])[0]
                    .get("content", {})
                    .get("parts", [{}])[0]
                    .get("text", "")
            )

            if not text:
                continue

            # Strip markdown code fences if present
            text = text.strip()
            if text.startswith("```"):
                text = text.split("```", 2)[-1] if "```" in text[3:] else text
                if text.startswith("json"):
                    text = text[4:]
                text = text.rstrip("`").strip()

            result = json.loads(text)
            return result

        except Exception as e:
            print(f"Gemini {model} error:", e)
            continue

    return _offline_result("All Gemini models temporarily unavailable")


def _offline_result(reason: str) -> dict:
    """
    Safe offline result when AI is unavailable.
    Shows a clear message without crashing.
    """
    return {
        "is_plant": True,
        "plant_name": "Plant (AI offline)",
        "plant_confidence": 0,
        "disease_name": "Analysis unavailable",
        "disease_confidence": 0,
        "status": "Analysis Unavailable",
        "symptoms": [f"Could not analyze: {reason}"],
        "organic_treatment": ["Please try again in a moment."],
        "chemical_treatment": ["Please try again in a moment."],
        "severity": "Unknown",
        "prevention": ["Ensure you have a stable internet connection."]
    }


@router.post("/predict")
async def predict(file: UploadFile = File(...)):

    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="Please upload a valid plant image (JPG, PNG, WEBP)."
        )

    image_bytes = await file.read()

    if not image_bytes or len(image_bytes) < 100:
        raise HTTPException(status_code=400, detail="Uploaded image is empty or too small.")

    # Validate it's a real image
    try:
        img = Image.open(io.BytesIO(image_bytes))
        img.verify()
    except Exception:
        raise HTTPException(status_code=400, detail="File is not a valid image.")

    try:
        result = _analyze_with_gemini(image_bytes, file.content_type)

        is_plant = result.get("is_plant", True)
        status = result.get("status", "Unknown")
        detected_subject = result.get("detected_subject", "")
        plant_name = result.get("plant_name", "Unknown plant")
        disease_name = result.get("disease_name", "No disease detected")

        # Double check for non-plant / human indicators in response
        non_plant_keywords = [
            "human", "person", "man", "woman", "face", "selfie", "people",
            "body", "skin", "animal", "dog", "cat", "car", "vehicle",
            "building", "room", "not a plant", "indoor", "gadget", "phone"
        ]
        
        detected_subject_lower = str(detected_subject).lower()
        plant_name_lower = str(plant_name).lower()
        
        if (
            not is_plant
            or status == "Non-Plant Detected"
            or any(k in detected_subject_lower for k in non_plant_keywords)
            or any(k in plant_name_lower for k in ["not a plant", "human", "person", "selfie", "face"])
        ):
            subject = detected_subject or "Non-Plant Subject / Human"
            err_msg = (
                result.get("error_message")
                or f"Non-plant image detected ({subject}). Please upload a clear photo of a plant leaf or crop."
            )
            return {
                "success": False,
                "is_plant": False,
                "error": err_msg,
                "status": "Non-Plant Detected",
                "detected_subject": subject,
                "filename": file.filename or "uploaded_image.jpg",
                "plant": "Not a Plant",
                "plant_confidence": 0.0,
                "disease": "Non-Plant Subject Detected",
                "confidence": 0.0,
                "severity": "None",
                "symptoms": [f"The uploaded image does not appear to contain a plant leaf. Detected: {subject}."],
                "actions": ["Please upload or capture a clear photo of an agricultural plant or leaf."],
                "solution": ["Please upload a clear photo of an agricultural plant leaf."],
                "organic_treatment": [],
                "chemical_treatment": [],
                "prevention": ["Ensure the camera is focused directly on the crop foliage."],
                "model": "KrishiAI Vision (Gemini)",
                "model_connected": True
            }

        plant_confidence = float(result.get("plant_confidence", 0))
        disease_confidence = float(result.get("disease_confidence", 0))
        symptoms = result.get("symptoms", [])
        organic = result.get("organic_treatment", [])
        chemical = result.get("chemical_treatment", [])
        severity = result.get("severity", "Unknown")
        prevention = result.get("prevention", [])

        # Build combined actions list
        actions = []
        if organic:
            actions.append("🌿 ORGANIC: " + organic[0])
        if chemical:
            actions.append("💊 CHEMICAL: " + chemical[0])
        actions += prevention

        return {
            "success": True,
            "is_plant": True,
            "status": status,
            "filename": file.filename or "uploaded_image.jpg",

            "plant": plant_name,
            "plant_confidence": round(plant_confidence, 1),

            "disease": disease_name,
            "confidence": round(disease_confidence, 1),
            "severity": severity,

            "symptoms": symptoms,
            "actions": actions,
            "solution": actions,

            "organic_treatment": organic,
            "chemical_treatment": chemical,
            "prevention": prevention,

            "model": "KrishiAI Vision (Gemini)",
            "model_connected": True
        }

    except HTTPException:
        raise

    except Exception as e:
        print("Disease prediction error:", e)
        raise HTTPException(
            status_code=500,
            detail=f"Plant analysis failed: {str(e)}"
        )


@router.get("/status")
def model_status():
    return {
        "model_connected": bool(GEMINI_API_KEY),
        "model": "KrishiAI Vision (Gemini)",
        "api": "Gemini Vision API"
    }