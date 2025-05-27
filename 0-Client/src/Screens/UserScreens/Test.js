import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [contextPhrase, setContextPhrase] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [searchDisabled, setSearchDisabled] = useState(false);

  useEffect(() => {
    if (searchDisabled) return;

    const fetchSuggestions = async () => {
      if (contextPhrase.length < 3) {
        setSuggestions([]);
        return;
      }
      try {
        const response = await axios.post('http://localhost:5000/search', { context_phrase: contextPhrase });
        setSuggestions(response.data.suggestions);
      } catch (error) {
        console.error('Error fetching suggestions', error);
      }
    };

    const debounceTimeout = setTimeout(fetchSuggestions, 300); // 300ms debounce time

    return () => clearTimeout(debounceTimeout);
  }, [contextPhrase, searchDisabled]);

  const handleSuggestionClick = (suggestion) => {
    setContextPhrase(suggestion);
    setSuggestions([]);
    setSearchDisabled(true);
  };

  const handleInputChange = (e) => {
    setContextPhrase(e.target.value);
    setSearchDisabled(false);
  };

  return (
    <div>
      <input 
        type="text"
        value={contextPhrase}
        onChange={handleInputChange}
        placeholder="Enter a phrase"
      />
      <ul>
        {suggestions.map((suggestion, index) => (
          <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
            {suggestion}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;



/*
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from google.cloud import bigquery
import requests
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Add this line to enable CORS for your Flask app


# Uncomment the line below and replace "path-to-service-account-key-json" with the actual path to your service account key JSON file.
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "database_keys.json"

# Specify your Google Cloud project ID
project_id = "monjoor"
client = bigquery.Client(project=project_id)

@app.route('/autocomplete', methods=['GET'])
def autocomplete():
    query = request.args.get('queryimport React, { useState } from 'react';
import axios from 'axios';

const SearchComponent = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState('');

  const URL_ENDPOINT = 'http://localhost:9200' //'http://34.65.164.247:9200'; // Elasticsearch URL endpoint
  const INDEX_NAME = 'test-index'; // Elasticsearch index name

  const handleSearch = async () => {
    try {
      const response = await axios.get(`${URL_ENDPOINT}/${INDEX_NAME}/_search`, {
        params: {
          q: query
        }
      });

      const hits = response.data.hits.hits;
      console.log(response)
      const searchResults = hits.map(hit => ({
        videoId: hit._id,
        videoTitle: hit._source.videoTitle,
        videoDescription: hit._source.videoDescription
      }));
      setSearchResults(searchResults);
    } catch (error) {
      console.error('Error searching:', error);
      setError('Error fetching search results.');
    }
  };

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Enter search query"
      />
      <button onClick={handleSearch}>Search</button>
      <div>
        {error && <p>{error}</p>}
        {searchResults.length > 0 ? (
          <ul>
            {searchResults.map((result, index) => (
              <li key={index}>
                <p>Video Title: {result.videoTitle}</p>
                <p>Video ID: {result.videoId}</p>
                <p>Video Description: {result.videoDescription}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchComponent;

/*

This works with the web version of elastic search


import React, { useState } from 'react';
import axios from 'axios';

Comment under
{
  "id": "3RQQzI4ByahsSoqU8mih",
  "name": "a",
  "expiration": 1713425446561,
  "api_key": "N2__wtH5SLmGWgO4ARS9wQ",
  "encoded": "M1JRUXpJNEJ5YWhzU29xVThtaWg6TjJfX3d0SDVTTG1HV2dPNEFSUzl3UQ==",
  "beats_logstash_format": "3RQQzI4ByahsSoqU8mih:N2__wtH5SLmGWgO4ARS9wQ"
}
Comment upper

const SearchComponent = () => {
  const [query, setQuery] = useState('');
  const [results, setSearchResults] = useState([]);
  const [error, setError] = useState(null);

  const URL_ENDPOINT = "https://f3c263c451074d5e96a0e6b663ba3ffd.europe-west3.gcp.cloud.es.io:443"
  const INDEX_NAME = 'elastic_data_youtube_videos';
  const API_KEY = 'M1JRUXpJNEJ5YWhzU29xVThtaWg6TjJfX3d0SDVTTG1HV2dPNEFSUzl3UQ==';

  const handleSearch = async () => {
    try {
      const response = await axios.get(`${URL_ENDPOINT}/${INDEX_NAME}/_search`, {
        params: {
          q: query
        },
        headers: {
          Authorization: `ApiKey ${API_KEY}`
        }
      });

      const hits = response.data.hits.hits;
      console.log(hits)
      const searchResults = hits.map(hit => ({
        videoId: hit._id, // Assuming videoId is stored as Elasticsearch document id
        videoTitle: hit._source.title,
        thumbnail: hit._source.thumbnail // Assuming thumbnail field is present in Elasticsearch document
      }));
      setSearchResults(searchResults);
    } catch (error) {
      console.error('Error searching:', error);
      setError('Error fetching search results.');
    }
  };

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Enter search query"
      />
      <button onClick={handleSearch}>Search</button>
      <div>
        {error && <p>{error}</p>}
        {results.length > 0 ? (
          <ul>
            {results.map((result, index) => (
              <li key={index}>{result}</li>
            ))}
          </ul>
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchComponent;

*/
/*
# Construct the BigQuery SQL query
sql_query = f"""
    SELECT query.query, base.title
    FROM VECTOR_SEARCH(
        TABLE `autocomplete_monjoor_dataset.embeddings`, 'ml_generate_embedding_result',
        (
            SELECT ml_generate_embedding_result, content AS query
            FROM ML.GENERATE_EMBEDDING(
                MODEL `autocomplete_monjoor_dataset.embedding_model`,
                (SELECT '{query}' AS content)
            )
        ),
        top_k => 5, options => '{{"fraction_lists_to_search": 0.01}}'
    )
"""

# Execute the BigQuery SQL query
query_job = client.query(sql_query)

# Fetch results
results = query_job.result()

# Convert results to JSON
autocomplete_results = [{'query': row.query, 'title': row.title} for row in results]

return jsonify(autocomplete_results)

if __name__ == '__main__':
app.run(debug=True)

*/
