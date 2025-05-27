// searchFunctions.js

import axios from 'axios';

const handleSearch = async (query, URL_ENDPOINT, INDEX_NAME, API_KEY, setSearchResults, navigate, setIsLoading, setError) => {
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
    const searchResults = hits.map(hit => ({
      videoId: hit._source.video_id, // Assuming videoId is stored as Elasticsearch document id
      videoTitle: hit._source.title,
    }));
    setSearchResults(searchResults);
    navigate('/youtube-videos/search-results', { state: { searchResults: searchResults } }); // Use navigate instead of history.push
    console.log(searchResults)
    setIsLoading(true)
  } catch (error) {
    console.error('Error searching:', error);
    setError('Error fetching search results.');
    setIsLoading(true)
  }
};

export default handleSearch;
