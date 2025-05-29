# Monjoor Backend Service

## Introduction

The **Monjoor Backend Service** is the central API and orchestration layer for the Monjoor platform.
It handles all core data management, user and video administration, integration with cloud storage and Elasticsearch, and communication with all supporting services (search, recommendation, difficulty classification, translation, and more).
Built with **Node.js (Express)**, the backend exposes RESTful APIs for CRUD operations, analytics, and admin tasks.

---

## Environment Configuration

Before starting the service, **create a `.env` file in the project root** with the following variables.
Replace the values in angle brackets with your actual credentials.

```env
PORT=3000

##############################################
#            GOOGLE CLOUD STORAGE            #
##############################################
GOOGLE_KEYS_PATH=./monjoor-bucket-storage-key.json
GOOGLE_BUCKET_NAME=<your_bucket_name>
DATABASE_FILE_NAME=database.json
API_KEY=<your_firebase_api_key>

##############################################
#                ELASTICSEARCH               #
##############################################
ELASTICSEARCH_HOST="https://<your_elasticsearch_host>:9200/"
ELASTICSEARCH_INDEX="monjoor-videos-index"
ELASTICSEARCH_USER=<your_elasticsearch_username>
ELASTICSEARCH_PASSWORD=<your_elasticsearch_password>

##############################################
#                SERVICES URLS               #
##############################################
DIFFICULTY_MODEL_URL=<your_french_difficulty_model_url>
GERMAN_DIFFICULTY_MODEL_URL=<your_german_difficulty_model_url>
TRANSLATION_API_URL=<your_translation_service_url>
SEARCH_RECOMMENDATION_API_URL=<your_search_service_url>
YOUTUBE_TRANSCRIPT_API_URL=<your_transcript_service_url>

##############################################
#                ADMIN SETTINGS              #
##############################################
ADMIN_PASSWORD=<your_admin_password>
```

**Notes:**

* Do **not** commit your `.env` or service account key to version control.
* All variables are required for the service to function.
* Adjust service URLs for your deployment (local, staging, or production).
* Ensure that you admin password match the one configured for the [Admin App](../1-Admin/)

---

## Deployment

### Run Locally

**1. Install dependencies:**

```bash
npm install
```

**2. Set up your environment:**

* Place your `.env` file at the project root.
* Place your Google service account JSON as specified.

**3. Start the backend server:**

```bash
npm run start
```

* The service will be available by default at `http://localhost:3000/`

---

### Deploy with Docker

**To run the service in a Docker container:**

```bash
docker build -t monjoor-backend .
docker run -p 3000:3000 --env-file .env -v $(pwd)/monjoor-bucket-storage-key.json:/app/monjoor-bucket-storage-key.json monjoor-backend
```

---

### Deploy on Google Cloud Run

This service can be deployed to Google Cloud Run for managed scaling and secure API hosting.
Be sure to configure secrets and environment variables securely (use Secret Manager or build-time environment injection).

---

## API Endpoints

Here’s a summary of core endpoints (see code or OpenAPI/Postman documentation for full details):

| Method | Endpoint                           | Description                                            |
| ------ | ---------------------------------- | ------------------------------------------------------ |
| GET    | `/admin/statistics`                | Get platform statistics                                |
| POST   | `/admin/backupElasticsearchIndex`  | Backup an Elasticsearch index                          |
| POST   | `/admin/restoreElasticsearchIndex` | Restore data to an Elasticsearch index                 |
| POST   | `/admin/syncElasticsearchIndex`    | Synchronize Elasticsearch and DB                       |
| GET    | `/storage/videos/:videoId`         | Get video by ID                                        |
| GET    | `/storage/videos/`                 | Get all videos in the database                         |
| GET    | `/video/search?query=...`          | Search for videos by query                             |
| GET    | `/translation/translate?word=...`  | Get translation for a word                             |
| GET    | `/video/autocomplete?query=...`    | Autocomplete search terms                              |
| POST   | `/video/recommendation`            | Get recommended videos based on transcript and videoId |
| POST   | `/video/add/:videoId`              | Add a video to the database                            |
| DELETE | `/video/delete/:videoId`           | Delete a video by ID                                   |
| PUT    | `/video/edit/:videoId`             | Update video details                                   |
| PUT    | `/video/update-fields/`            | Update specific fields of one or more videos           |

> **Admin routes require the `ADMIN_PASSWORD` set in your `.env` and must be sent as a header in the request.**

---

## Additional Information

* **Framework:** Node.js (Express)
* **Database:** Google Cloud Storage (JSON), Elasticsearch
* **Cloud Deployment:** Google Cloud Run (recommended), Docker, or any cloud VM
* **Integrated Services:** Search & Recommendation, Difficulty Model (French & German), Translation, YouTube Transcript

---

## Troubleshooting

* Ensure all referenced service URLs and credentials in your `.env` are correct.
* For cloud storage or Elasticsearch errors, confirm network access and permissions.
* For admin routes, verify the password is sent in the request header.

---

## Security

* **Never commit your `.env` or service account keys to Git!**
* Restrict API keys and service accounts to least-privilege.
* For production, use HTTPS and proper authentication.

---

For more details or API examples, see the [Postman collection](../5-Postman/) or your API documentation.
