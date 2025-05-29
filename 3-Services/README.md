# Monjoor Platform — Microservices Overview

This directory contains all microservices powering the Monjoor language learning platform.
Each service is independent and must be **set up and configured individually** before starting the full system.

---

## Microservices Structure

```
3-Services/
│
├── README.md                ← (this file)
├── YoutubeTranscript/       ← YouTube transcript extraction microservice
├── Translation/             ← Translation microservice
├── SearchAndRecommendationService/ ← Semantic search & recommendation microservice
├── DifficultyModel/         ← Difficulty classification model microservice
└── ... (additional services)
```

---

## Setup Instructions

**Each microservice has its own README with:**

* Introduction and core features
* Environment variables required (`.env` files)
* API endpoints and usage
* Deployment instructions (local, Docker, Cloud Run, etc.)

Before running the platform, **follow the setup guide in each subfolder:**

* [YouTube Transcript Service](./YoutubeTranscript/README.md)
* [Translation Service](./Translation/README.md)
* [Search & Recommendation Service](./SearchAndRecommendationService/README.md)
* [Difficulty Model Service](./DifficultyModel/README.md)

> Make sure to configure all environment variables, credentials, and service dependencies as described in each README.

---

## Running the System

* You can start services individually for development and testing (usually with `npm start` or `python app.py`).
* For production, deploy each service as a separate Docker container or Google Cloud Run service.
* The main backend communicates with these microservices via REST APIs; ensure that all endpoints are reachable (update service URLs in environment configs as needed).

---

## Additional Notes

* **Credentials:** Never commit sensitive keys or `.env` files to version control.
* **Order:** Some services (like Search/Recommendation) require Elasticsearch or other dependencies to be running first.
* **Collaboration:** See each service’s README for contact and contribution info.

---

For more information on the overall system and integration, see the main project documentation or the backend README.
