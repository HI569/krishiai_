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
    Use Gemini Vision to detect plant diseases.
    Falls back to a safe offline result if the API is unavailable.
    """
    import httpx, json

    if not GEMINI_API_KEY:
        return _offline_result("Gemini API key not configured")

    image_b64 = base64.b64encode(image_bytes).decode("utf-8")
    mime_type = content_type if content_type.startswith("image/") else "image/jpeg"

    prompt = """You are an expert plant pathologist and agronomist.
Analyze this plant leaf image carefully and respond ONLY with valid JSON in this exact format:

{
  "plant_name": "<scientific or common plant name>",
  "plant_confidence": <0-100 number>,
  "disease_name": "<disease name or 'Healthy - No disease detected'>",
  "disease_confidence": <0-100 number>,
  "status": "<'Healthy Plant' or 'Disease Detected'>",
  "symptoms": ["<symptom 1>", "<symptom 2>", "<symptom 3>"],
  "organic_treatment": ["<organic remedy 1>", "<organic remedy 2>", "<organic remedy 3>"],
  "chemical_treatment": ["<chemical remedy 1>", "<chemical remedy 2>", "<chemical remedy 3>"],
  "severity": "<'Low' or 'Moderate' or 'High'>",
  "prevention": ["<prevention tip 1>", "<prevention tip 2>"]
}

Rules:
- If plant is healthy, set disease_name to 'Healthy - No disease detected', status to 'Healthy Plant', disease_confidence to 0.
- Be specific about disease names (e.g. 'Tomato Late Blight', 'Wheat Rust', 'Rice Blast').
- Provide practical, actionable Indian agricultural remedies.
- Respond ONLY with JSON, no markdown, no explanation."""

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
            "temperature": 0.2,
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

        plant_name = result.get("plant_name", "Unknown plant")
        plant_confidence = float(result.get("plant_confidence", 0))
        disease_name = result.get("disease_name", "No disease detected")
        disease_confidence = float(result.get("disease_confidence", 0))
        status = result.get("status", "Unknown")
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