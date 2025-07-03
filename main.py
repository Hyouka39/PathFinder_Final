from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import pandas as pd
import numpy as np
import mysql.connector
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score
import joblib
import os
import traceback
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file

app = FastAPI()

# Allow CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to your frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PersonalityRequest(BaseModel):
    answers: List[float]

# Load data from MySQL with error handling
def load_data_from_mysql():
    try:
        conn = mysql.connector.connect(
            host=os.getenv("DB_HOST"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASS"),
            database=os.getenv("DB_NAME"),
            port=int(os.getenv("DB_PORT", 3306))
        )
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM data_")
        data = cursor.fetchall()
        conn.close()
        return data
    except mysql.connector.Error as err:
        print("Error loading from MySQL:", err)
        return []

# Train and save models if not already saved
def train_and_save_models():
    data = load_data_from_mysql()
    if not data:
        return None, None

    columns = ["code", "Strand"] + [f"Q{i}" for i in range(1, 49)]
    df = pd.DataFrame(data, columns=columns)

    label_encoder = LabelEncoder()
    df["code"] = label_encoder.fit_transform(df["code"])

    x = df.drop(columns=["code", "Strand"])
    y = df["code"]

    scaler = StandardScaler()
    X = scaler.fit_transform(x)

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    svm_model = SVC(kernel="rbf", C=1.0, gamma="scale", probability=True)
    svm_model.fit(X_train, y_train)

    knn_model = KNeighborsClassifier(n_neighbors=4, metric='euclidean')
    knn_model.fit(X_train, y_train)

    joblib.dump(svm_model, "svm_model.pkl")
    joblib.dump(knn_model, "knn_model.pkl")
    joblib.dump(scaler, "scaler.pkl")
    joblib.dump(label_encoder, "label_encoder.pkl")

    return svm_model, knn_model

# Load or train models
try:
    svm_model = joblib.load("svm_model.pkl")
    knn_model = joblib.load("knn_model.pkl")
    scaler = joblib.load("scaler.pkl")
    label_encoder = joblib.load("label_encoder.pkl")
except:
    svm_model, knn_model = train_and_save_models()
    scaler = joblib.load("scaler.pkl")
    label_encoder = joblib.load("label_encoder.pkl")

@app.get("/")
def root():
    return {"message": "API is running!"}

@app.post("/predict")
def predict(request: PersonalityRequest):
    try:
        features = np.array(request.answers).reshape(1, -1)
        features_scaled = scaler.transform(features)

        svm_pred = svm_model.predict(features_scaled)[0]
        knn_pred = knn_model.predict(features_scaled)[0]

        return {
            "svm_prediction": label_encoder.inverse_transform([svm_pred])[0],
            "knn_prediction": label_encoder.inverse_transform([knn_pred])[0]
        }
    except Exception as e:
        print(traceback.format_exc())
        return {"error": str(e)}
