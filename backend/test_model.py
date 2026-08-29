from fastapi import APIRouter, UploadFile, File, HTTPException
from PIL import Image
import tensorflow as tf
import numpy as np
import json
import os
import io

router = APIRouter()

# ============================================================
# PATHS
# ============================================================

BASE_DIR = os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))
)

MODEL_PATH = os.path.join(
    BASE_DIR,
    "models",
    "plant_disease_model.keras"
)

CLASS_NAMES_PATH = os.path.join(
    BASE_DIR,
    "models",
    "class_names.json"
)

# ============================================================
# LOAD MODEL
# ============================================================

model = None
class_names = []
MODEL_CONNECTED = False

try:
    model = tf.keras.models.load_model(MODEL_PATH)

    with open(
        CLASS_NAMES_PATH,
        "r",
        encoding="utf-8"
    ) as f:
        class_names = json.load(f)

    MODEL_CONNECTED = True

    print("========================================")
    print("PLANT DISEASE MODEL LOADED")
    print("MODEL:", MODEL_PATH)
    print("CLASSES:", len(class_names))
    print("INPUT:", model.input_shape)
    print("OUTPUT:", model.output_shape)
    print("========================================")

except Exception as e:
    print("========================================")
    print("ERROR LOADING PLANT DISEASE MODEL")
    print(e)
    print("========================================")


# ============================================================
# DISEASE INFORMATION
# ============================================================

DISEASE_INFO = {

    "Tomato_Early_blight": {
        "symptoms": [
            "Brown circular spots on older leaves",
            "Yellowing around leaf lesions",
            "Leaves may dry and fall"
        ],
        "actions": [
            "Remove severely infected leaves",
            "Improve air circulation",
            "Avoid overhead irrigation",
            "Keep the plant area clean"
        ]
    },

    "Tomato_Late_blight": {
        "symptoms": [
            "Dark irregular leaf lesions",
            "Rapid browning of leaves",
            "Water-soaked appearance",
            "Fruit may develop dark lesions"
        ],
        "actions": [
            "Remove severely infected plant material",
            "Improve air circulation",
            "Avoid overhead irrigation",
            "Separate severely infected plants"
        ]
    },

    "Tomato_Bacterial_spot": {
        "symptoms": [
            "Small dark spots on leaves",
            "Yellowing around lesions",
            "Spots may appear on fruit"
        ],
        "actions": [
            "Remove severely affected leaves",
            "Avoid working with wet plants",
            "Improve air circulation",
            "Use clean gardening tools"
        ]
    },

    "Tomato_Leaf_Mold": {
        "symptoms": [
            "Yellow patches on upper leaf surfaces",
            "Olive or brown fungal growth underneath leaves",
            "Leaves may curl and dry"
        ],
        "actions": [
            "Improve ventilation",
            "Reduce excessive humidity",
            "Avoid overhead irrigation",
            "Remove severely affected leaves"
        ]
    },

    "Tomato_Septoria_leaf_spot": {
        "symptoms": [
            "Small circular leaf spots",
            "Dark margins around lesions",
            "Yellowing and leaf drop"
        ],
        "actions": [
            "Remove affected leaves",
            "Keep foliage dry",
            "Improve air circulation",
            "Remove fallen infected leaves"
        ]
    },

    "Tomato_Spider_mites_Two_spotted_spider_mite": {
        "symptoms": [
            "Small yellow or pale spots",
            "Leaf discoloration",
            "Fine webbing may appear"
        ],
        "actions": [
            "Inspect the underside of leaves",
            "Remove heavily affected leaves",
            "Wash plants with appropriate water spray",
            "Monitor nearby plants"
        ]
    },

    "Tomato__Target_Spot": {
        "symptoms": [
            "Circular target-like lesions",
            "Brown spots on leaves",
            "Leaf yellowing"
        ],
        "actions": [
            "Remove infected leaves",
            "Improve air circulation",
            "Avoid overhead irrigation",
            "Remove infected plant debris"
        ]
    },

    "Tomato__Tomato_mosaic_virus": {
        "symptoms": [
            "Mosaic light and dark green leaf pattern",
            "Leaf distortion",
            "Reduced plant growth"
        ],
        "actions": [
            "Remove severely infected plants",
            "Disinfect tools after handling plants",
            "Control insect vectors",
            "Avoid handling healthy plants after infected plants"
        ]
    },

    "Tomato__Tomato_YellowLeaf__Curl_Virus": {
        "symptoms": [
            "Yellowing of leaves",
            "Upward curling of leaves",
            "Stunted plant growth"
        ],
        "actions": [
            "Remove severely infected plants",
            "Control whitefly populations",
            "Remove weeds around the crop",
            "Monitor nearby plants"
        ]
    },

    "Potato___Early_blight": {
        "symptoms": [
            "Dark circular spots on leaves",
            "Concentric ring patterns",
            "Yellowing of affected leaves"
        ],
        "actions": [
            "Remove infected plant material",
            "Improve air circulation",
            "Avoid overhead irrigation",
            "Monitor nearby plants"
        ]
    },

    "Potato___Late_blight": {
        "symptoms": [
            "Dark water-soaked leaf lesions",
            "Rapid browning of foliage",
            "Dark lesions may develop on tubers"
        ],
        "actions": [
            "Remove severely infected plant material",
            "Avoid overhead irrigation",
            "Improve air circulation",
            "Separate severely infected plants"
        ]
    },

    "Pepper__bell___Bacterial_spot": {
        "symptoms": [
            "Small dark spots on leaves",
            "Leaf yellowing",
            "Raised spots may appear on fruit"
        ],
        "actions": [
            "Remove severely affected leaves",
            "Avoid overhead irrigation",
            "Improve air circulation",
            "Sanitize gardening tools"
        ]
    },

    "Pepper__bell___healthy": {
        "symptoms": [
            "No major disease symptoms detected",
            "Leaves appear healthy"
        ],
        "actions": [
            "Continue regular crop monitoring",
            "Maintain proper irrigation",
            "Provide adequate nutrition",
            "Monitor for new symptoms"
        ]
    },

    "Potato___healthy": {
        "symptoms": [
            "No major disease symptoms detected",
            "Plant appears healthy"
        ],
        "actions": [
            "Continue regular monitoring",
            "Maintain proper irrigation",
            "Maintain balanced plant nutrition",
            "Monitor for disease symptoms"
        ]
    },

    "Tomato_healthy": {
        "symptoms": [
            "No major disease symptoms detected",
            "Leaves appear healthy"
        ],
        "actions": [
            "Continue regular crop monitoring",
            "Maintain proper irrigation",
            "Maintain balanced nutrition",
            "Monitor for new symptoms"
        ]
    }
}


# ============================================================
# IMAGE PREPROCESSING
# ============================================================

def prepare_image(image: Image.Image):

    # Convert image to RGB
    image = image.convert("RGB")

    # EXACT MODEL INPUT SIZE
    image = image.resize((224, 224))

    # Convert to float32 numpy array
    image_array = np.array(
        image,
        dtype=np.float32
    )

    # IMPORTANT:
    # MobileNetV2 preprocessing
    # converts RGB [0,255] -> [-1,1]
    image_array = tf.keras.applications.mobilenet_v2.preprocess_input(
        image_array
    )

    # Add batch dimension
    image_array = np.expand_dims(
        image_array,
        axis=0
    )

    return image_array


# ============================================================
# PREDICT
# ============================================================

@router.post("/predict")
async def predict(
    file: UploadFile = File(...)
):

    # --------------------------------------------------------
    # CHECK FILE
    # --------------------------------------------------------

    if not file.content_type:
        raise HTTPException(
            status_code=400,
            detail="File type could not be determined."
        )

    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="Please upload a valid image file."
        )

    # --------------------------------------------------------
    # CHECK MODEL
    # --------------------------------------------------------

    if model is None or not MODEL_CONNECTED:
        raise HTTPException(
            status_code=500,
            detail="Plant disease model is not loaded."
        )

    # --------------------------------------------------------
    # PREDICTION
    # --------------------------------------------------------

    try:

        image_bytes = await file.read()

        if not image_bytes:
            raise HTTPException(
                status_code=400,
                detail="Uploaded image is empty."
            )

        image = Image.open(
            io.BytesIO(image_bytes)
        )

        processed_image = prepare_image(image)

        prediction = model.predict(
            processed_image,
            verbose=0
        )

        probabilities = prediction[0]

        # ----------------------------------------------------
        # TOP PREDICTION
        # ----------------------------------------------------

        predicted_index = int(
            np.argmax(probabilities)
        )

        confidence = float(
            probabilities[predicted_index]
        ) * 100

        if predicted_index < len(class_names):
            disease = class_names[predicted_index]
        else:
            disease = "Unknown"

        # ----------------------------------------------------
        # TOP 3 PREDICTIONS
        # ----------------------------------------------------

        top_indices = np.argsort(
            probabilities
        )[-3:][::-1]

        top_predictions = []

        for index in top_indices:

            index = int(index)

            if index < len(class_names):

                top_predictions.append({
                    "disease": class_names[index],
                    "confidence": round(
                        float(probabilities[index]) * 100,
                        2
                    )
                })

        # ----------------------------------------------------
        # DISEASE INFORMATION
        # ----------------------------------------------------

        info = DISEASE_INFO.get(
            disease,
            {
                "symptoms": [
                    "The model detected a possible plant condition."
                ],
                "actions": [
                    "Monitor the plant carefully.",
                    "Take another clear image if symptoms change.",
                    "Consult an agricultural expert for confirmation."
                ]
            }
        )

        # ----------------------------------------------------
        # STATUS
        # ----------------------------------------------------

        if "healthy" in disease.lower():
            status = "Healthy Plant"
        else:
            status = "Possible Disease Detected"

        # ----------------------------------------------------
        # RESPONSE
        # ----------------------------------------------------

        return {

            "status": status,

            "filename": file.filename,

            "disease": disease,

            "confidence": round(
                confidence,
                2
            ),

            "symptoms": info["symptoms"],

            "actions": info["actions"],

            "solution": info["actions"],

            "top_predictions": top_predictions,

            "model": "plant_disease_model.keras",

            "model_connected": MODEL_CONNECTED
        }

    except HTTPException:
        raise

    except Exception as e:

        print(
            "Plant disease prediction error:",
            e
        )

        raise HTTPException(
            status_code=500,
            detail=f"Plant analysis failed: {str(e)}"
        )


# ============================================================
# MODEL STATUS
# ============================================================

@router.get("/status")
def model_status():

    return {

        "model_connected": MODEL_CONNECTED,

        "model": "plant_disease_model.keras",

        "classes": len(class_names),

        "input_size": "224x224",

        "preprocessing": "MobileNetV2"
    }