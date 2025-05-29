from elasticsearch import Elasticsearch
from utils.embeddings import get_transcript_embeddings
import os

class RecommendationService:
    def __init__(self):
        self.client = Elasticsearch(
            os.getenv("ELASTICSEARCH_URL"),
            basic_auth=(os.getenv("ELASTICSEARCH_USER"), os.getenv("ELASTICSEARCH_PASSWORD")),
            verify_certs=False
        )
        self.index_name = os.getenv("ELASTICSEARCH_INDEX_NAME")

    def get_recommended_videos(self, video_id, transcript):
        # Generate transcript embeddings
        embeddings = get_transcript_embeddings(transcript)
        if embeddings is None:
            return {"error": "Failed to generate embeddings"}, 500

        # Elasticsearch k-NN search with filtering to exclude the current video
        search_body = {
            "size": 30,  # Adjust the number of results as needed
            "query": {
                "bool": {
                    "must": {
                        "script_score": {
                            "query": {"match_all": {}},
                            "script": {
                                "source": "cosineSimilarity(params.query_vector, 'transcript_embedding') + 1.0",
                                "params": {"query_vector": embeddings}
                            }
                        }
                    },
                    "must_not": {
                        "term": {"video_id": video_id}  # Exclude the given video_id
                    }
                }
            }
        }

        response = self.client.search(index=self.index_name, body=search_body)
        
        if response['hits']['total']['value'] == 0:
            return {"error": "No similar videos found"}, 404

        # Format results
        similar_videos = [
            {
                "video_id": hit["_source"]["video_id"],
                "title": hit["_source"]["title"],
                "score": hit["_score"]
            }
            for hit in response['hits']['hits']
        ]

        return similar_videos, 200

