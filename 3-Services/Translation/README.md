# Translation Service

## **Description**
The `Translation Service` is a Flask-based API that provides words, sentences and text translation functionality using the `googletrans` library. It supports both GET and POST methods, allowing users to translate a multiple words into English. The service is designed to handle multiple request formats and includes error handling for invalid or missing input.

### **Deployed Service**
The service is live and can be accessed at:

🔗 [Translation Service](https://monjoor-translation-203751395944.europe-west6.run.app/translate?word=%22Bienvenue%20sur%20le%20service%20de%20traduction%20du%20projet%20monjoor%22)

You can directly interact with the API by sending requests to the provided endpoints.


---

## **Endpoints**

### **1. Translate Word**
- **URL**: `/translate`
- **Method**: `GET` or `POST`
- **Description**: Translates a given word into English.
  
#### **GET Request**:
- **Query Parameter**:
  - `word`: The word to be translated (e.g., `?word=bonjour`).
  
#### **POST Request**:
- **Request Body**:
  ```json
  {
      "word": "<Word to be translated>"
  }
  ```

#### **Response**:
- **Success**:
  ```json
  {
      "translation": "<Translated Word>"
  }
  ```
- **Error**:
  - If no word is provided:
    ```json
    {
        "error": "No word provided"
    }
    ```
  - If an internal error occurs:
    ```json
    {
        "error": "<Error Message>"
    }
    ```
- **Error Codes**:
  - `400`: Missing or invalid input.
  - `500`: Internal server error.

---

## **Deploy Locally (Python venv)**

1. **Create a Virtual Environment**:
   ```bash
   python3.11 -m venv TranslationServiceVenv
   ```

2. **Activate the Virtual Environment**:
   - **Linux/macOS**:
     ```bash
     source TranslationServiceVenv/bin/activate
     ```
   - **Windows**:
     ```bash
     TranslationServiceVenv\Scripts\activate
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
   - Use tools like `Postman`, `curl`, or a browser (for GET requests) to test the `/translate` endpoint.
   - For more details or API examples, see the [Postman collection](../../5-Postman/) or your API documentation.

---

## **Deploy Using Docker**

1. **Build the Docker Image**:
   ```bash
   docker build -t translationservice .
   ```

2. **Run the Docker Container**:
   ```bash
   docker run -p 8080:8080 translationservice
   ```

3. **Access the Service**:
   - Use the `/translate` endpoint as described above.

---

## **Environment Requirements**

- **Python Version**: 3.11
- **Libraries**:
  - `Flask`
  - `flask-cors`
  - `googletrans`
  - `werkzeug`
- **Docker (Optional)**: Required for containerized deployment.

---

## **Examples**

### **1. Translate Word (GET Request)**
- **Request**:
  ```
  GET http://localhost:8080/translate?word=bonjour
  ```
- **Response**:
  ```json
  {
      "translation": "hello"
  }
  ```

### **2. Translate Word (POST Request)**
- **Request**:
  ```json
  POST http://localhost:8080/translate
  {
      "word": "bonjour"
  }
  ```
- **Response**:
  ```json
  {
      "translation": "hello"
  }
  ```

### **3. Error Example**
- **Request**:
  ```
  GET http://localhost:8080/translate
  ```
- **Response**:
  ```json
  {
      "error": "No word provided"
  }
  ```

---

## **Future Enhancements**
- **Support for Multiple Languages**: Allow translation into languages other than English.
- **Language Detection**: Automatically detect the source language of the word.
