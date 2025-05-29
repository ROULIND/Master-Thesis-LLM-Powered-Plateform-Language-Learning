from flask import Flask, request, jsonify
from flask_cors import CORS
from googletrans import Translator

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/translate', methods=['GET', 'POST'])
def translate():
    # Handle GET request
    if request.method == 'GET':
        word = request.args.get('word', '')  # Extract 'word' from query parameters
    else:  # Handle POST request
        data = request.get_json()
        word = data.get('word', '')

    if not word:
        return jsonify({"error": "No word provided"}), 400

    translator = Translator()
    try:
        translation = translator.translate(word, dest='en')  # Translate to English
        return jsonify({"translation": translation.text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=8080, host='0.0.0.0')
