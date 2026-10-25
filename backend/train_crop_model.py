
from pathlib import Path

import joblib
import pandas as pd

from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import train_test_split

# Paths
BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR / "data" / "Crop_recommendation.csv"
MODEL_DIR = BASE_DIR / "models"
MODEL_PATH = MODEL_DIR / "crop_recommendation_model.joblib"

# Load dataset
df = pd.read_csv(DATA_PATH)

# Validate the expected columns
features = [
    "N",
    "P",
    "K",
    "temperature",
    "humidity",
    "ph",
    "rainfall",
]

target = "label"

required_columns = features + [target]
missing_columns = set(required_columns) - set(df.columns)

if missing_columns:
    raise ValueError(f"Missing dataset columns: {sorted(missing_columns)}")

if df[required_columns].isnull().any().any():
    raise ValueError("Dataset contains missing values.")

X = df[features]
y = df[target]

print("Dataset rows:", len(df))
print("Number of crop classes:", y.nunique())
print("Crop labels:", sorted(y.unique()))

# Split before training to evaluate on unseen test records
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y,
)

# Train the model
model = RandomForestClassifier(
    n_estimators=200,
    random_state=42,
    class_weight="balanced",
    n_jobs=-1,
)

print("\nTraining crop recommendation model...")
model.fit(X_train, y_train)

# Evaluate on the held-out test set
predictions = model.predict(X_test)

accuracy = accuracy_score(y_test, predictions)

print(f"\nTest accuracy: {accuracy:.4f} ({accuracy * 100:.2f}%)")
print("\nClassification report:")
print(classification_report(y_test, predictions, zero_division=0))

# Save model and expected feature order
MODEL_DIR.mkdir(parents=True, exist_ok=True)

joblib.dump(
    {
        "model": model,
        "features": features,
        "crop_classes": sorted(y.unique()),
        "dataset_rows": len(df),
        "test_accuracy": accuracy,
    },
    MODEL_PATH,
)

print("\nModel saved to:", MODEL_PATH)
print("Training complete!")
