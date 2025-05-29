import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import AutoTokenizer
import onnxruntime as ort
from google.cloud import storage

app = Flask(__name__)
CORS(app)

# Service account key path
SERVICE_ACCOUNT_KEY_PATH = "./monjoor-bucket-storage-key.json"

# Define GCS parameters
GCS_BUCKET_NAME = "monjoor-model"
GCS_MODEL_PATH = "germanModel/model.onnx"
LOCAL_MODEL_PATH = "model.onnx"  # Path to download ONNX model locally

# Define tokenizer path
tokenizer_path = './germanDifficultyModel'  # Path to your tokenizer

# Authenticate with Google Cloud using the service account key
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = SERVICE_ACCOUNT_KEY_PATH

# Load tokenizer
tokenizer = AutoTokenizer.from_pretrained(tokenizer_path)

# Function to download the ONNX model from GCS
def download_model_from_gcs(bucket_name, source_blob_name, destination_file_name):
    """Download the ONNX model from GCS."""
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(source_blob_name)
    blob.download_to_filename(destination_file_name)
    print(f"Model downloaded from GCS to {destination_file_name}")

# Ensure the model is downloaded
if not os.path.exists(LOCAL_MODEL_PATH):
    print("Downloading model from Google Cloud Storage...")
    download_model_from_gcs(GCS_BUCKET_NAME, GCS_MODEL_PATH, LOCAL_MODEL_PATH)

# Load the ONNX model
ort_session = ort.InferenceSession(LOCAL_MODEL_PATH)

# Label mapping
label2id = {
    "A1": 0,
    "A2": 1,
    "B1": 2,
    "B2": 3,
    "C1": 4,
    "C2": 5
}
id2label = {v: k for k, v in label2id.items()}

@app.route("/", methods=["GET", "POST"])
def predict_form():
    return "Welcome to the ONNX model API!"

@app.route("/predict", methods=["POST"])
def predict_text_difficulty():
    # Parse the JSON request body
    data = request.get_json()

    if not data or "transcript" not in data:
        return jsonify({"error": "Missing 'transcript' in the request body."}), 400

    transcript = data["transcript"]

    # Preprocess the input
    inputs = preprocess_function(transcript)

    # Perform ONNX inference
    ort_inputs = {
        "input_ids": inputs["input_ids"].numpy(),
        "attention_mask": inputs["attention_mask"].numpy(),
    }
    ort_outputs = ort_session.run(None, ort_inputs)

    # Get predictions
    predictions = ort_outputs[0].argmax(axis=1).item()
    predicted_label = id2label[predictions]

    # Create response
    response = {
        "text": transcript,
        "predicted_difficulty": predicted_label
    }
    return jsonify(response)


def preprocess_function(string):
    return tokenizer(
        [string],
        truncation=True,
        return_tensors="pt",
        max_length=128,
        padding="max_length"
    )


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8083)))
