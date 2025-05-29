from elasticsearch import Elasticsearch
import os
import re

class ElasticsearchService:
    def __init__(self):
        elasticsearch_url = os.getenv("ELASTICSEARCH_URL")
        if not elasticsearch_url:
            raise ValueError("ELASTICSEARCH_URL environment variable is not set.")

        self.client = Elasticsearch(
            hosts=[elasticsearch_url],  # Ensure this is passed as a list
            basic_auth=(
                os.getenv("ELASTICSEARCH_USER"),
                os.getenv("ELASTICSEARCH_PASSWORD")
            ),
            verify_certs=False  # Adjust based on your SSL setup
        )
        self.index_name = os.getenv("ELASTICSEARCH_INDEX_NAME")

    def autocomplete(self, query, user_language):
        # Split the query into parts (e.g., splitting on spaces, hyphens, and apostrophes)
        query_parts = [part for part in re.split(r"[ \-']", query) if part]

        cumulative_titles = set()
        
        for i, part in enumerate(query_parts):
            body = {
                "_source": False,
                "query": {
                    "bool": {
                        "must": [
                            {"term": {"language": user_language}}
                        ],
                        "should": [
                            {"match_phrase_prefix": {"topics": part}},
                            {"match_phrase_prefix": {"subtopics": part}},
                            {"match_phrase_prefix": {"entities": part}}
                        ]
                    }
                },
                "highlight": {
                    "fields": {
                        "topics": {},
                        "subtopics": {},
                        "entities": {}
                    }
                },
                "size": 10
            }

            response = self.client.search(index=self.index_name, body=body)

            # Extract keywords from the highlights
            current_titles = set()
            for hit in response.get('hits', {}).get('hits', []):
                highlight = hit.get('highlight', {})
                for field in ['topics', 'subtopics', 'entities']:
                    for match in highlight.get(field, []):
                        # Remove highlight tags and clean up the match
                        cleaned_match = match.replace("<em>", "").replace("</em>", "").strip()
                        current_titles.add(cleaned_match.lower())

            # Use cumulative intersection for multi-part queries
            if i == 0:
                cumulative_titles = current_titles
            else:
                cumulative_titles = cumulative_titles.intersection(current_titles)

            if not cumulative_titles:
                break  # Exit early if no matches remain

        # Format the results
        return [{"query": f'"{query}"', "title": title.capitalize()} for title in cumulative_titles]


    
