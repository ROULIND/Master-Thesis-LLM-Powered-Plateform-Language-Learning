from flask import Flask, jsonify, request
from flask_cors import CORS
from services.elasticsearch_service import ElasticsearchService
from services.keyword_generation_service import KeywordGenerationService
from services.vector_search_service import VectorSearchService
from services.recommendation_service import RecommendationService
from utils.embeddings import get_transcript_embeddings
from dotenv import load_dotenv
import os

app = Flask(__name__)
CORS(app)

# Load environment variables
load_dotenv()

# Services
es_service = ElasticsearchService()
keyword_service = KeywordGenerationService()
vector_service = VectorSearchService()
recommendation_service = RecommendationService()

@app.route('/')
def home():
    return "Welcome to the Search and Recommendation API!"

@app.route('/autocomplete', methods=['GET'])
def autocomplete():
    query = request.args.get('query', '')
    userLanguage = request.args.get('userLanguage', '')
    
    # Optionally, you can return an error if any of the required parameters are missing.
    if not query or not userLanguage:
        return jsonify([])  # or return an error message with an appropriate HTTP status code

    results = es_service.autocomplete(query, userLanguage)
    return jsonify(results)


@app.route('/get-video-keywords', methods=['POST'])
def get_video_keywords():
    data = request.get_json()
    transcript = data.get('transcript', '')
    if not transcript:
        return jsonify({"error": "Missing transcript"}), 400

    keywords = keyword_service.generate_keywords(transcript)
    return jsonify(keywords)


@app.route('/get-video-embeddings', methods=['POST'])
def get_video_embeddings():
    """
    API endpoint to generate embeddings for a given transcript.
    """
    data = request.get_json()
    transcript = data.get('transcript', '')
    print(transcript)
    if not transcript:
        return jsonify({"error": "Transcript is required"}), 400

    embeddings = get_transcript_embeddings(transcript)
    if embeddings is None:
        return jsonify({"error": "Failed to generate embeddings"}), 500

    return jsonify({"embeddings": embeddings})


@app.route('/vector-search', methods=['POST'])
def vector_search():
    data = request.get_json()
    query = data.get('query', '')
    if not query:
        return jsonify({"error": "Missing query"}), 400

    # Perform the vector search
    results = vector_service.search(query)
    return jsonify(results)


@app.route('/get-recommended-videos', methods=['POST'])
def get_recommended_videos():
    data = request.get_json()
    video_id = data.get('videoId')
    transcript = data.get('transcript')

    if not video_id or not transcript:
        return jsonify({"error": "Both 'videoId' and 'transcript' are required"}), 400

    results, status_code = recommendation_service.get_recommended_videos(video_id, transcript)
    return jsonify(results), status_code



if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8084)
