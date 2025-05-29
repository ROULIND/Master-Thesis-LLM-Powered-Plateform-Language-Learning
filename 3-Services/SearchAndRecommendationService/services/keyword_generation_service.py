import os
import json
from openai import OpenAI

class KeywordGenerationService:
    def __init__(self):
        # Load the OpenAI API key from environment variables
        self.api_key = os.getenv("OPENAI_API_KEY")
    
    def generate_keywords(self, transcript):
        if not transcript:
            return {"error": "Transcript is empty"}

        # Define the prompt for GPT-3.5-turbo
        prompt = f"""
        Vous êtes chargé d'identifier les sujets principaux, les sous-thèmes et les entités notables dans le texte suivant. Assurez-vous que les résultats soient dans la même langue que le texte fourni. Si le texte est en allemand, les résultats doivent être en allemand. Si le texte est en français, les résultats doivent être en français.

        Texte : {transcript}

        1. Identifiez et listez les 3 sujets ou catégories principaux. Ils doivent être sous forme d'un mot ou de plusieurs mots, mais pas de phrase.
        2. Si des sous-thèmes ou des thèmes secondaires sont mentionnés dans le texte, listez-les également. Au maximum 5 éléments sont attendus. Ils doivent être sous forme d'un ou plusieurs mots.
        3. Si des entités notables (personnes, lieux, marques, produits, etc.) sont mentionnées dans le texte et jouent un rôle dans les sujets, mentionnez-les et leurs associations. Visez entre 5 éléments, et exprimez chaque entité sous forme d'un ou plusieurs mots.

        Assurez-vous que vos étiquettes soient claires, concises et reflètent les sujets ou catégories les plus importants du texte. Respectez la langue originale du texte.

        Voici le schéma de sortie attendu :
        {{
            "videoTopics": [""],
            "videoSubtopics": [""],
            "videoEntities": [""]
        }}

        Ne répondez pas avec vos propres suggestions, recommandations ou avis.
        """

        client = OpenAI(api_key=self.api_key)

        try:
            # Call OpenAI's ChatCompletion API using GPT-3.5-turbo
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "Vous êtes un assistant spécialisé dans l'extraction de thématiques et entités clés à partir de textes."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7  # Adjust temperature as needed
            )

            # Extract the assistant's reply from the response
            response_text = response.choices[0].message.content

            # Process the response to extract JSON data
            cleaned_output = response_text.replace('\\n', '').replace('\\"', '"')
            json_start = cleaned_output.find('{')
            json_end = cleaned_output.rfind('}') + 1
            json_string = cleaned_output[json_start:json_end]

            # Parse and return the JSON output
            return json.loads(json_string)

        except json.JSONDecodeError as e:
            print(f"Error parsing JSON: {e}")
            return {"error": "Failed to parse response from GPT-3.5-turbo"}

        except Exception as e:
            print(f"Unexpected error: {e}")
            return {"error": "An error occurred while generating keywords"}
