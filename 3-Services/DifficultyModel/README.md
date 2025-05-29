# Difficulty Model Service

## Introduction

The **Difficulty Model Service** provides CEFR-based automatic text difficulty classification for the Monjoor platform. It uses a fast ONNX inference backend and is designed to load large model files from Google Cloud Storage (GCS) at startup—keeping the Docker container lightweight and deployable anywhere.

---

## Model Hosting on Google Cloud Storage

To avoid oversized containers, **the ONNX model is stored on a Google Cloud Storage (GCS) bucket** and downloaded at service startup.

### Steps:

1. **Upload your ONNX model** (e.g., `model.onnx`) to a GCS bucket.
2. **Download your Google Cloud service account key** (e.g., `monjoor-bucket-storage-key.json`) and place it at the project root.
3. **Set up your Python code** to authenticate and download the model at runtime (see sample below).
4. **Mount or copy your service account key** in production (e.g., via Docker volume or secret manager).

---

## Required Files

* `monjoor-bucket-storage-key.json` (GCP service account key)
* ONNX model in GCS (`monjoor-model/germanModel/model.onnx`)
* Tokenizer directory in your project (`./germanDifficultyModel`)

---

## API Endpoints

| Method | Endpoint   | Arguments (**required**) | Description                            |
| ------ | ---------- | ------------------------ | -------------------------------------- |
| POST   | `/predict` | `transcript` (str, JSON) | Predict the CEFR difficulty for a text |

**Example request:**

```json
{
  "transcript": "Ich lerne seit einem Jahr Deutsch."
}
```

**Example response:**

```json
{
  "text": "Ich lerne seit einem Jahr Deutsch.",
  "predicted_difficulty": "B1"
}
```

---

## Running the Service Locally

1. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

2. **Add your service account key** to the project root as `monjoor-bucket-storage-key.json`.

3. **Configure paths** in your code (GCS bucket name, model path, key path) if different from defaults.

4. **Start the server**

   ```bash
   python app.py
   ```

   The service will download the model from GCS if not already present.

---

## Why use GCS?

* Keeps the Docker image small (model not bundled)
* Allows easy model updates—just upload a new model to GCS
* Secure access using a GCP service account

---

## Notes

* **Do not commit your GCP key to version control.**
* For production, consider secret managers or volume mounts for the service account key.
* The service listens by default on port `8083` (configurable via `PORT` env variable).

