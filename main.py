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
import traceback

app = FastAPI()

# Allow CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to your frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the input model
class PersonalityRequest(BaseModel):
    answers: List[float]

# Load data from MySQL
def load_data_from_mysql():
    conn = mysql.connector.connect(
        host="yamabiko.proxy.rlwy.net",
        user="root",
        password="olWpnrySKjEFvDnxYowwoTGaAVCVmKwe",
        database="railway",
        port=45222
    )
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM data_")
    data = cursor.fetchall()
    conn.close()
    return data

# Prepare dataset
data = load_data_from_mysql()
columns = ["code", "Strand"] + [f"Q{i}" for i in range(1, 49)]
df = pd.DataFrame(data, columns=columns)

label_encoder = LabelEncoder()
df["code"] = label_encoder.fit_transform(df["code"])

x = df.drop(columns=["code", "Strand"])
y = df["code"]

scaler = StandardScaler()
X = scaler.fit_transform(x)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train models
svm_model = SVC(kernel="rbf", C=1.0, gamma="scale", probability=True)
svm_model.fit(X_train, y_train)

knn_model = KNeighborsClassifier(n_neighbors=4, metric='euclidean')
knn_model.fit(X_train, y_train)

svm_accuracy = accuracy_score(y_test, svm_model.predict(X_test))

# Health check endpoint
@app.get("/")
def root():
    return {"message": "API is running!"}

# Predict personality route
@app.post("/predict")
def predict_personality(request: PersonalityRequest):
    try:
        input_data = pd.DataFrame([request.answers], columns=x.columns)
        input_scaled = scaler.transform(input_data)

        # SVM prediction
        svm_prediction = svm_model.predict(input_scaled)
        svm_label = label_encoder.inverse_transform(svm_prediction)[0]

        # KNN nearest neighbors
        distances, indices = knn_model.kneighbors(input_scaled)

        recommended_programs = []
        confidence_scores = []

        for i in range(4):
            index = indices[0][i]
            label = label_encoder.inverse_transform([y_train.iloc[index]])[0]
            confidence = (1 / (1 + distances[0][i])) * 100
            recommended_programs.append(label)
            confidence_scores.append(confidence)

        if svm_label in recommended_programs:
            final_confidence = np.mean(confidence_scores) * (1 + svm_accuracy)
            final_program = svm_label
        else:
            final_confidence = np.mean(confidence_scores) * (1 - svm_accuracy)
            final_program = recommended_programs[0]

        final_confidence = min(final_confidence, 100)

        return {
            "svm_result": svm_label,
            "knn_result": recommended_programs[0],  # or return all 4 if you prefer
            "confidence": round(final_confidence, 2)
        }

    except Exception as e:
        return {
            "error": str(e),
            "trace": traceback.format_exc()
        }
