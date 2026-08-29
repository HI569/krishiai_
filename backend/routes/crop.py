from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
import joblib
import numpy as np

router = APIRouter()

# ============================================================
# MODEL PATH
# ============================================================

BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.abspath(__file__)
    )
)

MODEL_PATH = os.path.join(
    BASE_DIR,
    "ml",
    "crop_recommendation_model.joblib"
)

# ============================================================
# LOAD MODEL
# ============================================================

model = None

try:
    model = joblib.load(MODEL_PATH)

    print("====================================")
    print("Crop Recommendation Model Loaded")
    print("Model:", MODEL_PATH)
    print("Model type:", type(model).__name__)
    print("====================================")

except Exception as e:
    print("====================================")
    print("ERROR LOADING CROP MODEL")
    print(e)
    print("====================================")


# ============================================================
# INPUT DATA
# ============================================================

class CropInput(BaseModel):
    n: float
    p: float
    k: float
    ph: float
    temperature: float
    humidity: float
    rainfall: float
    season: str = "Rabi"
    location: str = ""


# ============================================================
# CROP INFORMATION
# ============================================================

CROP_INFO = {

    "rice": {
        "name": "Rice",
        "water": "High",
        "season": "Kharif",
        "info": "Suitable for warm conditions with high humidity and sufficient rainfall.",
        "icon": "🌾"
    },

    "maize": {
        "name": "Maize",
        "water": "Medium",
        "season": "Kharif",
        "info": "Suitable for moderate to warm temperatures with balanced nutrients.",
        "icon": "🌽"
    },

    "wheat": {
        "name": "Wheat",
        "water": "Medium",
        "season": "Rabi",
        "info": "Generally suitable for cooler growing conditions.",
        "icon": "🌾"
    },

    "cotton": {
        "name": "Cotton",
        "water": "Medium",
        "season": "Kharif",
        "info": "Performs well in warm conditions with suitable soil moisture.",
        "icon": "🌿"
    },

    "chickpea": {
        "name": "Chickpea",
        "water": "Low",
        "season": "Rabi",
        "info": "Suitable for relatively dry conditions and well-drained soils.",
        "icon": "🌱"
    },

    "banana": {
        "name": "Banana",
        "water": "High",
        "season": "Year-round",
        "info": "Requires warm temperatures, humidity and regular water availability.",
        "icon": "🍌"
    },

    "coffee": {
        "name": "Coffee",
        "water": "Medium",
        "season": "Year-round",
        "info": "Suitable for warm, humid growing environments.",
        "icon": "☕"
    },

    "coconut": {
        "name": "Coconut",
        "water": "High",
        "season": "Year-round",
        "info": "Prefers warm humid conditions and good water availability.",
        "icon": "🥥"
    },

    "apple": {
        "name": "Apple",
        "water": "Medium",
        "season": "Rabi",
        "info": "Generally associated with cooler growing conditions.",
        "icon": "🍎"
    },

    "mango": {
        "name": "Mango",
        "water": "Medium",
        "season": "Year-round",
        "info": "Warm conditions and suitable soil drainage are generally preferred.",
        "icon": "🥭"
    },

    "grapes": {
        "name": "Grapes",
        "water": "Medium",
        "season": "Rabi",
        "info": "Requires suitable temperature and well-drained soil.",
        "icon": "🍇"
    },

    "papaya": {
        "name": "Papaya",
        "water": "Medium",
        "season": "Year-round",
        "info": "Prefers warm conditions and adequate moisture.",
        "icon": "🍈"
    },

    "orange": {
        "name": "Orange",
        "water": "Medium",
        "season": "Year-round",
        "info": "Suitable for warm conditions with appropriate soil properties.",
        "icon": "🍊"
    },

    "pomegranate": {
        "name": "Pomegranate",
        "water": "Low",
        "season": "Rabi",
        "info": "Can perform well under relatively dry conditions.",
        "icon": "🍎"
    },

    "watermelon": {
        "name": "Watermelon",
        "water": "Medium",
        "season": "Kharif",
        "info": "Prefers warm conditions and adequate soil moisture.",
        "icon": "🍉"
    },

    "muskmelon": {
        "name": "Muskmelon",
        "water": "Medium",
        "season": "Kharif",
        "info": "Prefers warm temperatures and suitable soil moisture.",
        "icon": "🍈"
    },

    "blackgram": {
        "name": "Black Gram",
        "water": "Low",
        "season": "Kharif",
        "info": "Suitable for warm conditions with moderate water requirements.",
        "icon": "🌱"
    },

    "mungbean": {
        "name": "Mung Bean",
        "water": "Low",
        "season": "Kharif",
        "info": "Generally suitable for warm conditions and moderate rainfall.",
        "icon": "🌱"
    },

    "lentil": {
        "name": "Lentil",
        "water": "Low",
        "season": "Rabi",
        "info": "Generally suited to cooler conditions and lower water requirements.",
        "icon": "🌱"
    },

    "kidneybeans": {
        "name": "Kidney Beans",
        "water": "Medium",
        "season": "Kharif",
        "info": "Suitable for moderate temperatures and well-drained soil.",
        "icon": "🌱"
    },

    "pigeonpeas": {
        "name": "Pigeon Peas",
        "water": "Medium",
        "season": "Kharif",
        "info": "Suitable for warm conditions and moderate rainfall.",
        "icon": "🌱"
    },

    "jute": {
        "name": "Jute",
        "water": "High",
        "season": "Kharif",
        "info": "Prefers warm, humid conditions with adequate water.",
        "icon": "🌿"
    },

    "mothbeans": {
        "name": "Moth Beans",
        "water": "Low",
        "season": "Kharif",
        "info": "Well suited to warm and relatively dry conditions.",
        "icon": "🌱"
    }
}


# ============================================================
# RECOMMEND CROP
# ============================================================

@router.post("/recommend")
def recommend(x: CropInput):

    # --------------------------------------------------------
    # CHECK MODEL
    # --------------------------------------------------------

    if model is None:
        raise HTTPException(
            status_code=500,
            detail="Crop recommendation model is not loaded."
        )

    try:

        # ----------------------------------------------------
        # MODEL INPUT
        # ----------------------------------------------------

        features = np.array([[
            x.n,
            x.p,
            x.k,
            x.temperature,
            x.humidity,
            x.ph,
            x.rainfall
        ]])

        # ----------------------------------------------------
        # PREDICTION
        # ----------------------------------------------------

        prediction = model.predict(features)

        predicted_crop = str(prediction[0])

        # ----------------------------------------------------
        # CONFIDENCE
        # ----------------------------------------------------

        confidence = None

        if hasattr(model, "predict_proba"):

            probabilities = model.predict_proba(features)[0]

            confidence = float(
                np.max(probabilities) * 100
            )

        # ----------------------------------------------------
        # CROP INFORMATION
        # ----------------------------------------------------

        crop_key = predicted_crop.lower()

        info = CROP_INFO.get(
            crop_key,
            {
                "name": predicted_crop.title(),
                "water": "Moderate",
                "season": x.season,
                "info": "The machine learning model recommends this crop based on the supplied soil and climate conditions.",
                "icon": "🌱"
            }
        )

        # ----------------------------------------------------
        # RESPONSE
        # ----------------------------------------------------

        result = {
            "crop": info["name"],
            "suitability": round(
                confidence if confidence is not None else 0,
                2
            ),
            "confidence": round(
                confidence if confidence is not None else 0,
                2
            ),
            "season": info["season"],
            "water": info["water"],
            "info": info["info"],
            "icon": info["icon"],
            "location": x.location,

            "input": {
                "N": x.n,
                "P": x.p,
                "K": x.k,
                "temperature": x.temperature,
                "humidity": x.humidity,
                "ph": x.ph,
                "rainfall": x.rainfall
            },

            "model": "Random Forest Classifier"
        }

        return {
            "recommendations": [result],
            "model": "Random Forest Classifier",
            "location": x.location
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Crop prediction failed: {str(e)}"
        )