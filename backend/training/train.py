import os
import json
import numpy as np
import tensorflow as tf
from PIL import Image

MODEL_PATH = "models/plant_disease_model.keras"
CLASS_PATH = "models/class_names.json"
DATASET_PATH = "training/data/PlantVillage"

print("\n========================================")
print("PLANT DISEASE MODEL TEST")
print("========================================")

# Load model
print("\nLoading model...")

model = tf.keras.models.load_model(MODEL_PATH)

print("MODEL LOADED")
print("Input :", model.input_shape)
print("Output:", model.output_shape)

# Load classes
with open(CLASS_PATH, "r", encoding="utf-8") as f:
    classes = json.load(f)

print("\nClasses:", len(classes))

# Check every class
print("\n========================================")
print("TESTING ONE IMAGE FROM EACH CLASS")
print("========================================")

correct = 0
total = 0

for real_class in classes:

    class_folder = os.path.join(
        DATASET_PATH,
        real_class
    )

    if not os.path.isdir(class_folder):
        print("MISSING:", real_class)
        continue

    image_file = None

    for filename in os.listdir(class_folder):
        if filename.lower().endswith(
            (".jpg", ".jpeg", ".png")
        ):
            image_file = filename
            break

    if image_file is None:
        print("NO IMAGE:", real_class)
        continue

    image_path = os.path.join(
        class_folder,
        image_file
    )

    # Load image
    image = Image.open(image_path).convert("RGB")
    image = image.resize((224, 224))

    # Convert to numpy
    image_array = np.array(
        image,
        dtype=np.float32
    )

    # MobileNetV2 preprocessing
    image_array = (
        tf.keras.applications.mobilenet_v2
        .preprocess_input(image_array)
    )

    # Add batch dimension
    image_array = np.expand_dims(
        image_array,
        axis=0
    )

    # Prediction
    prediction = model.predict(
        image_array,
        verbose=0
    )[0]

    predicted_index = int(
        np.argmax(prediction)
    )

    predicted_class = classes[
        predicted_index
    ]

    confidence = float(
        prediction[predicted_index]
    ) * 100

    total += 1

    if predicted_class == real_class:
        correct += 1
        result = "✓ CORRECT"
    else:
        result = "✗ WRONG"

    print(
        f"{result} | "
        f"REAL: {real_class} | "
        f"PRED: {predicted_class} | "
        f"{confidence:.2f}%"
    )

# Final result
print("\n========================================")
print("TEST RESULT")
print("========================================")

print("Correct:", correct)
print("Total  :", total)

if total > 0:
    accuracy = (
        correct / total
    ) * 100

    print(
        f"Accuracy on test images: "
        f"{accuracy:.2f}%"
    )

print("\n========================================")
print("TEST COMPLETE")
print("========================================")