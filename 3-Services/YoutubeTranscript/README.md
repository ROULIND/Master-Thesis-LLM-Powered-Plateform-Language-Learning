# YouTubeTranscript Service

## **Description**
The `YouTubeTranscript` service is a Flask-based API that retrieves the transcript of a YouTube video using the `YouTubeTranscriptApi` library. It provides two main features:
1. Fetch the raw transcript of a YouTube video.
2. Use OpenAI's GPT API to enhance the transcript by restoring punctuation and capitalization for improved readability.

### **Deployed Service**
The service is live and can be accessed at:

🔗 [YouTubeTranscript Service](https://monjoor-youtube-transcript-service-203751395944.europe-west6.run.app)

You can directly interact with the API by sending requests to the provided endpoints.

---

## **Endpoints**

### **1. Health Check**
- **URL**: `/`
- **Method**: `GET`
- **Description**: Returns a simple "Hello, World!" response to verify that the service is running.

### **2. Get Video Transcript (Processed with GPT)**
- **URL**: `/get-video-transcript`
- **Method**: `POST`
- **Description**: Retrieves the transcript of a YouTube video and processes it with GPT to restore punctuation and capitalization.
- **Request Body**:
  ```json
  {
      "video_id": "<YouTube Video ID>",
      "video_language": "<Preferred Language Code (e.g., 'en', 'fr')>"
  }
  ```
- **Response**:
  ```json
  {
      "transcript": "<Punctuated and Capitalized Transcript>"
  }
  ```
- **Error Codes**:
  - `400`: Missing or invalid input.
  - `500`: Internal server error.

### **3. Get Video Transcript (Raw, Without GPT)**
- **URL**: `/get-video-transcript-without-punctuation`
- **Method**: `POST`
- **Description**: Retrieves the raw transcript of a YouTube video without punctuation restoration or any processing.
- **Request Body**:
  ```json
  {
      "video_id": "<YouTube Video ID>",
      "video_language": "<Preferred Language Code (e.g., 'en', 'fr')>"
  }
  ```
- **Response**:
  ```json
  {
      "transcript": "<Raw Transcript Without Punctuation>"
  }
  ```
- **Error Codes**:
  - `400`: Missing or invalid input.
  - `500`: Internal server error.

---

## **Deploy Locally (Python venv)**

1. **Create a Virtual Environment**:
   ```bash
   python3.11 -m venv YoutubeTranscriptVenv
   ```

2. **Activate the Virtual Environment**:
   - **Linux/macOS**:
     ```bash
     source YoutubeTranscriptVenv/bin/activate
     ```
   - **Windows**:
     ```bash
     YoutubeTranscriptVenv\Scripts\activate
     ```

3. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the Service**:
   ```bash
   python app.py
   ```
   - The service will start on port `8080`.

5. **Test the Service**:
   - Visit [http://localhost:8080](http://localhost:8080) in your browser to check the health of the service.
   - Use tools like `Postman` or `curl` to test the endpoints.
   - For more details or API examples, see the [Postman collection](../../5-Postman/) or your API documentation.
   

---

## **Deploy Using Docker**

1. **Build the Docker Image**:
   ```bash
   docker build -t youtubetranscriptservice .
   ```

2. **Run the Docker Container**:
   ```bash
   docker run -p 8080:8080 youtubetranscriptservice
   ```

3. **Access the Service**:
   - Visit [http://localhost:8080](http://localhost:8080) to verify the service is running.
   - Use the `/get-video-transcript` and `/get-video-transcript-without-punctuation` endpoints as described above.

---

## **Environment Requirements**

- **Python Version**: 3.11
- **Libraries**:
  - `Flask`
  - `Flask-CORS`
  - `werkzeug`
  - `youtube-transcript-api`
  - `openai`
- **Docker (Optional)**: Required for containerized deployment.

---

## **Future Enhancements**
- **API blocked on Google Cloud**: The service can no longer be deployed on Google Cloud as the IP is blocked by YouTube
