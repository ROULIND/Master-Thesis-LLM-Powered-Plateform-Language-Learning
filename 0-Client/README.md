<img src="../6-Images/Client-App-Main-Page.png" alt="Background Readme" style="width: 100%;">

# Client App

## Introduction

The **Client App** is the user-facing interface of the Monjoor platform, designed to deliver a personalized, video-based language learning experience powered by Large Language Models (LLMs). Users can browse, search, and interact with curated language learning videos, access transcripts, receive real-time translation, and benefit from AI-driven recommendations—all through a clean and intuitive web interface.

The app is built with **React** and communicates with the backend via RESTful APIs. It is optimized for modern browsers and designed for easy deployment both locally and in the cloud.

## Most important

* **Production URL**: [https://client-dot-monjoor-2025.oa.r.appspot.com/](https://client-dot-monjoor-2025.oa.r.appspot.com/)


Here’s a **clean and clear update** for your README section on environment configuration, **including the Firebase config** and using **placeholders** for sensitive values.

---

## Environment Configuration

Before starting the app, **create a `.env` file in the project root** with the following variables:

### **Backend API URL**

Choose the backend endpoint that fits your development setup:

* **For local development:**

  ```
  REACT_APP_API_URL=http://localhost:3000
  ```
* **For production/deployed version:**

  ```
  REACT_APP_API_URL=https://monjoor-backend-203751395944.europe-west6.run.app
  ```

### **Firebase Configuration**

Replace the placeholders below (`<...>`) with your actual Firebase project credentials:

```env
# --- Firebase Configuration ---
REACT_APP_FIREBASE_API_KEY=<your_firebase_api_key>
REACT_APP_FIREBASE_AUTH_DOMAIN=<your_firebase_auth_domain>
REACT_APP_FIREBASE_DATABASE_URL=<your_firebase_database_url>
REACT_APP_FIREBASE_PROJECT_ID=<your_firebase_project_id>
REACT_APP_FIREBASE_STORAGE_BUCKET=<your_firebase_storage_bucket>
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=<your_firebase_messaging_sender_id>
REACT_APP_FIREBASE_APP_ID=<your_firebase_app_id>
```

You can find these values in your [Firebase Console](https://console.firebase.google.com/) under **Project Settings > General > Your apps > Firebase SDK snippet**.


### **Sample `.env` File**

```env
# Backend API URL (choose one)
REACT_APP_API_URL=http://localhost:3000
# REACT_APP_API_URL=https://monjoor-backend-203751395944.europe-west6.run.app

# --- Firebase Configuration ---
REACT_APP_FIREBASE_API_KEY=<your_firebase_api_key>
REACT_APP_FIREBASE_AUTH_DOMAIN=<your_firebase_auth_domain>
REACT_APP_FIREBASE_DATABASE_URL=<your_firebase_database_url>
REACT_APP_FIREBASE_PROJECT_ID=<your_firebase_project_id>
REACT_APP_FIREBASE_STORAGE_BUCKET=<your_firebase_storage_bucket>
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=<your_firebase_messaging_sender_id>
REACT_APP_FIREBASE_APP_ID=<your_firebase_app_id>

# Port for client app
PORT=3001

```

---



## Deployment

### Deploying using npm

To run the client locally with npm:

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm start
```

* The app will run at `http://localhost:3001/`
* Hot reloading is enabled.
* **Node.js 18+** recommended.

### Deploy on Docker locally

To run the client app in a Docker container on your machine:

```bash
docker build -t monjoor-client .
docker run -p 3001:80 monjoor-client
```

* The app will be accessible at [http://localhost:3001](http://localhost:3001)
* Make sure Docker is installed and running.

### Deploy on Google Cloud

Deployment on Google Cloud Platform (App Engine):

```bash
npm run build
gcloud app deploy
gcloud app browse
```

* The app is deployed in **App Engine Standard Environment**.
* Make sure you are authenticated with `gcloud` and have the correct project selected.
* Update your `app.yaml` configuration if necessary.

---

## Additional Information

* **Frontend Framework:** React
* **API Communication:** RESTful endpoints to the backend
* **Supported Browsers:** Latest versions of Chrome, Firefox, Edge, Safari

## Troubleshooting

* If you encounter errors with API requests, check that your backend server is running and CORS policies are correctly configured.
* For Google Cloud deployments, ensure your billing is enabled and quotas are sufficient.
