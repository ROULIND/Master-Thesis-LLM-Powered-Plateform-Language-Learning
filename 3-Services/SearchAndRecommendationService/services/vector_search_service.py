from sklearn.preprocessing import normalize
from elasticsearch import Elasticsearch
from sentence_transformers import SentenceTransformer
import os

class VectorSearchService:
    def __init__(self):
        # Initialize Elasticsearch client
        self.client = Elasticsearch(
            os.getenv("ELASTICSEARCH_URL"),
            basic_auth=(os.getenv("ELASTICSEARCH_USER"), os.getenv("ELASTICSEARCH_PASSWORD")),
            verify_certs=False
        )
        self.index_name = os.getenv("ELASTICSEARCH_INDEX_NAME")

        # Initialize the SentenceTransformer model
        self.model = SentenceTransformer('sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2')

    def generate_query_vector(self, query):
        # Generate and normalize the query embedding
        embedding = self.model.encode(query)
        normalized_vector = normalize(embedding.reshape(1, -1))[0]
        return normalized_vector.tolist()

    def search(self, query):
        # Step 1: Generate query vector
        query_vector = self.generate_query_vector(query)

        # Step 2: Build the search body
        body = {
            "_source": ["title", "video_id"],
            "query": {
                "knn": {
                    "field": "transcript_embedding",  # Ensure this matches the correct field in the mapping
                    "query_vector": query_vector,
                    "k": 20,  
                    "num_candidates": 50  
                }
            },
            "size": 40
        }

        # Step 3: Perform the search
        response = self.client.search(index=self.index_name, body=body)

        # Step 4: Deduplicate based on video_id, keeping only the highest-score entry
        search_results = {}
        
        for hit in response["hits"]["hits"]:
            source = hit.get("_source", {})
            score = hit.get("_score", 0)
            video_id = source.get("video_id")

            # If video_id is not in search_results OR if this result has a higher score, keep it
            if video_id not in search_results or search_results[video_id]["similarity_score"] < score:
                search_results[video_id] = {
                    "title": source.get("title"),
                    "video_id": video_id,
                    "similarity_score": score
                }

        return list(search_results.values())  # Return only the unique, highest-score results

