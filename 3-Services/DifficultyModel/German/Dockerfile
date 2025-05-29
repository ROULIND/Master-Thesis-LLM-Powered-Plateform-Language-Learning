# Use a lightweight base image
FROM python:3.11-slim

# Set the working directory inside the container
WORKDIR /app

# Copy requirements.txt into the container
COPY requirements.txt .

# Install required Python libraries
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code into the container
COPY . .

# Set the environment variable for Google Cloud credentials
# The actual key file will be mounted during runtime
ENV GOOGLE_APPLICATION_CREDENTIALS=/app/service-account-key.json

# Expose the port the app runs on
EXPOSE 8083

# Command to run the Flask app
CMD ["python", "app.py"]
