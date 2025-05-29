from flask import Flask, jsonify, request
from flask_cors import CORS
from youtube_transcript_api import YouTubeTranscriptApi
from openai import OpenAI
import json

# Set up Flask app
app = Flask(__name__)
CORS(app)

# Set up the OpenAI client
client = OpenAI(api_key="YOUR_OPENAI_API_KEY") # Ensure the OpenAI API key is set


@app.route('/')
def index():
    return 'Hello, World!'


@app.route('/get-video-transcript', methods=['POST'])
def get_video_transcript():
    """
    Retrieves the transcript of a YouTube video and reconstructs text with GPT.
    """
    try:
        request_json = request.get_json()
        video_id = request_json['video_id']
        video_language = request_json['video_language']

        print(f"Fetching transcript for video ID: {video_id} in language: {video_language}")

        transcript, timed_transcript = fetch_transcript(video_id, video_language)

        response = {
            "transcript": transcript,
            "timed_transcript": timed_transcript
        }
        return jsonify(response), 200
    except KeyError:
        return jsonify({'error': 'Video ID not provided.'}), 400
    except Exception as e:
        return jsonify({'error': f"An error occurred: {e}"}), 500


def fetch_transcript(video_id, video_language):
    """
    Fetches the transcript for a given YouTube video and reconstructs it with GPT.
    """
    try:
        timed_transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=[video_language])
        transcript_text = " ".join([text['text'] for text in timed_transcript])
        reconstructed_text = reconstruct_with_gpt(transcript_text)
        return reconstructed_text, timed_transcript
    except Exception as e:
        raise RuntimeError(f"Error fetching transcript: {e}")


def reconstruct_with_gpt(text):
    """
    Sends the text to GPT for punctuation restoration and text reconstruction.
    """
    prompt = (
        f"Here is a transcript without proper punctuation and capitalization:\n\n"
        f"'{text}'\n\n"
        "Please restore proper punctuation, capitalization, and sentence structure. "
        "Return only the reconstructed text, not in a JSON format."
    )
    try:
        response = client.chat.completions.create(
            messages=[
                {"role": "user", "content": prompt}
            ],
            model="gpt-3.5-turbo",
        )
        response_content = response.choices[0].message.content.strip()

        return response_content
    except Exception as e:
        raise RuntimeError(f"Error in GPT processing: {e}")


@app.route('/get-video-transcript-without-punctuation', methods=['POST'])
def get_video_transcript_without_punctuation():
    """
    Retrieves the raw transcript of a YouTube video without any processing.
    """
    try:
        request_json = request.get_json()
        video_id = request_json['video_id']
        video_language = request_json['video_language']

        print(f"Fetching raw transcript for video ID: {video_id} in language: {video_language}")
        transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=[video_language])
        
        raw_transcript = " ".join([text['text'] for text in transcript])
        return jsonify({'transcript': raw_transcript}), 200
    except KeyError:
        return jsonify({'error': 'Video ID not provided.'}), 400
    except Exception as e:
        return jsonify({'error': f"An error occurred: {e}"}), 500


if __name__ == '__main__':
    app.run(debug=True, port=8082, host='0.0.0.0')
