import { Autocomplete } from '@mui/material';
import axios from 'axios';

// const aucompleteURL = 'http://localhost:5000';
const autcompleteURL = process.env.REACT_APP_AUTOCOMPLETE_URL;
const apiUrl = process.env.REACT_APP_API_URL;

export const handleSearch = async (query, setSearchResults, navigate, setIsLoading) => {
  try {
    // Uncomment the following line to use the matching keyword search
    //const searchVideosResponse = await axios.post(`${autcompleteURL}/search-videos-v2`, {

    /*const searchVideosResponse = await axios.post(`${autcompleteURL}/vector-search`, {
      query: query
    });*/

    const searchVideosResponse = await axios.get(`${apiUrl}/video/search?query=${query}`);
    console.log("Search Videos Response: ", searchVideosResponse.data);
    const results = searchVideosResponse.data; // Corrected data structure
    if (results.length > 0) {
      const searchResults = results.map((result) => ({
        videoId: result.video_id,
        //score: result.matched_count // Use the correct field name for the score
      }));

      navigate('/youtube-videos/search-results', { state: { searchResults: searchResults } });
    } else {
      setSearchResults([]);
    }

    setIsLoading(false);
  } catch (error) {
    console.error('Error searching:', error);
    setIsLoading(false);
  }
};
 

export const handleInputChange = async (event, setQuery, setSuggestions, userLanguage) => {
  const inputValue = event.target.value;
  console.log("call handle input change");
  setQuery(inputValue);
  console.log("inputValue: ", inputValue);
  console.log("userLanguage: ", userLanguage);
  if (inputValue.length === 0) {
    setSuggestions([]);
    return;
  }

  try {
    const response = await axios.get(`${apiUrl}/video/autocomplete`, {
      params: {
        query: inputValue,
        userLanguage: userLanguage
      }
    });
    console.log("response: ", response.data);
    console.log("userLanguage: ", userLanguage);
    setSuggestions(response.data);
  } catch (error) {
    console.error('Error fetching suggestions:', error);
  }
};





