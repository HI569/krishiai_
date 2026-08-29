import os
import json
import joblib
import pandas as pd

from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report


# ============================================================
# PATHS
# ============================================================

BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.abspath(__file__)
    )
)

DATA_DIR = os.path.join(
    BASE_DIR,
    "data"
)

ML_DIR = os.path.join(
    BASE_DIR,
    "ml"
)

os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(ML_DIR, exist_ok=True)


# ============================================================
# DATASET
# ============================================================

DATASET_PATH = os.path.join(
    DATA_DIR,
    "crop_recommendation.csv"
)

if not os.path.exists(DATASET_PATH):
    raise FileNotFoundError(
        f"Dataset not found:\n{DATASET_PATH}\n\n"
        "Please place crop_recommendation.csv inside backend/data/"
    )


# ============================================================
# LOAD DATA
# ============================================================

print("Loading crop dataset...")

df = pd.read_csv(DATASET_PATH)

print("Dataset shape:", df.shape)
print("Columns:")
print(df.columns.tolist())


# ============================================================
# REQUIRED COLUMNS
# ============================================================

FEATURES = [
    "N",
    "P",
    "K",
    "temperature",
    "humidity",
    "ph",
    "rainfall"
]

TARGET = "label"


missing = [
    column
    for column in FEATURES + [TARGET]
    if column not in df.columns
]

if missing:
    raise ValueError(
        f"Missing columns in dataset: {missing}"
    )


# ============================================================
# CLEAN DATA
# ============================================================

df = df.dropna(
    subset=FEATURES + [TARGET]
)

X = df[FEATURES]
y = df[TARGET]


# ============================================================
# TRAIN / TEST SPLIT
# ============================================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)


# ============================================================
# RANDOM FOREST MODEL
# ============================================================

print("\nTraining Random Forest...")

model = RandomForestClassifier(
    n_estimators=300,
    max_depth=None,
    random_state=42,
    n_jobs=-1
)

model.fit(
    X_train,
    y_train
)


# ============================================================
# EVALUATION
# ============================================================

predictions = model.predict(X_test)

accuracy = accuracy_score(
    y_test,
    predictions
)

print("\n========================================")
print("CROP MODEL TRAINING COMPLETE")
print("========================================")

print(
    f"Accuracy: {accuracy * 100:.2f}%"
)

print("\nClassification Report:")
print(
    classification_report(
        y_test,
        predictions
    )
)


# ============================================================
# SAVE MODEL
# ============================================================

MODEL_PATH = os.path.join(
    ML_DIR,
    "crop_recommendation_model.joblib"
)

joblib.dump(
    model,
    MODEL_PATH
)


# ============================================================
# SAVE FEATURE INFORMATION
# ============================================================

INFO_PATH = os.path.join(
    ML_DIR,
    "crop_model_info.json"
)

model_info = {
    "model": "Random Forest Classifier",
    "features": FEATURES,
    "target": TARGET,
    "classes": sorted(
        [str(x) for x in model.classes_]
    ),
    "accuracy": round(
        float(accuracy),
        4
    )
}

with open(
    INFO_PATH,
    "w",
    encoding="utf-8"
) as f:

    json.dump(
        model_info,
        f,
        indent=4
    )


print("\nModel saved:")
print(MODEL_PATH)

print("\nModel information saved:")
print(INFO_PATH)