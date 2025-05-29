from sentence_transformers import SentenceTransformer
from sklearn.preprocessing import normalize
import numpy as np

# Load the multilingual sentence-transformer model
model = SentenceTransformer('sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2')

def get_transcript_embeddings(transcript):
    """
    Function to fetch the video transcript, generate embeddings, and return the normalized embedding vector.
    """
    if not transcript:
        return None  # Return None if no transcript is available

    # Generate embeddings using the preloaded model
    embeddings = model.encode(transcript)
    # Normalize the embeddings to unit vectors
    normalized_embeddings = normalize(embeddings.reshape(1, -1))[0]

    return normalized_embeddings.tolist()
