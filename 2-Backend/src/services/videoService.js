const axios = require('axios');
const { youtubeAPI, apiKey, difficultyModelLink, germanDifficultyModelLink, autocompleteAPI, youtubeTranscriptAPI } = require('../config/constants');

// Fetch video details from the YouTube API
async function fetchVideoDetails(videoId) {
    const response = await axios.get(`${youtubeAPI}/videos`, {
        params: { id: videoId, key: apiKey, part: 'snippet,contentDetails,statistics' }
    });
    return response.data.items[0];
}

// Fetch category details from the YouTube API
async function fetchCategoryDetails(categoryId) {
    const response = await axios.get(`${youtubeAPI}/videoCategories`, {
        params: { id: categoryId, key: apiKey, part: 'snippet' }
    });
    return response.data.items[0].snippet;
}

// Fetch channel details from the YouTube API
async function fetchChannelDetails(channelId) {
    const response = await axios.get(`${youtubeAPI}/channels`, {
        params: { id: channelId, key: apiKey, part: 'snippet' }
    });
    return response.data.items[0].snippet;
}

// Fetch transcript from the transcript API
async function fetchTranscript(videoId, videoLanguage) {
    try {
        const payload = { video_id: videoId, video_language: videoLanguage };
        const response = await axios.post(`${youtubeTranscriptAPI}/get-video-transcript`, payload, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data.transcript || '';
    } catch (error) {
        console.error('Error fetching transcript:', error);
        return '';
    }
}


// Fetch predicted label from the difficulty model API
async function fetchPredictedLabel(videoId, transcript, videoLanguage) {
    try {
        if (videoLanguage === 'de') {
            console.log("German video difficulty model called")
            console.log("Transcript: " + transcript)
            console.log("Language: " + videoLanguage)
            const response = await axios.post(germanDifficultyModelLink, {
                transcript: transcript,
                language: videoLanguage
            }, {
                headers: { 'Content-Type': 'application/json' }
            });

            return response.data.predicted_difficulty;
        } 

        if (videoLanguage === 'fr') {
            const response = await axios.get(`${difficultyModelLink}${videoId}`);
            return response.data.predicted_label;
        }

        throw new Error(`Unsupported video language: ${videoLanguage}`);
    } catch (error) {
        console.error('Error fetching predicted label:', error);
        return null;
    }
}


// Fetch keywords from the autocomplete API
async function fetchKeywords(transcript) {
    try {
        const response = await axios.post(`${autocompleteAPI}/get-video-keywords`, { transcript });

        // Check if the API returned an error
        if (response.data.error) {
            console.error(`Error from autocompleteAPI: ${response.data.error}`);
            return { videoTopics: [], videoSubtopics: [], videoEntities: [] };
        }

        // Return the valid keywords response
        return response.data;
    } catch (error) {
        // Handle specific errors
        if (error.response && error.response.data && error.response.data.error) {
            console.error(`Error from autocompleteAPI: ${error.response.data.error}`);
        } else {
            console.error('Unexpected error fetching keywords:', error.message);
        }

        // Fallback response
        return { videoTopics: [], videoSubtopics: [], videoEntities: [] };
    }
}


async function fetchEmbeddings(transcript) {
    try {
        const response = await axios.post(`${autocompleteAPI}/get-video-embeddings`, { transcript });

        // Check if the API returned an error
        if (response.data.error) {
            console.error(`Error from autocompleteAPI: ${response.data.error}`);
            return { embeddings: [] }; // Return default empty embeddings
        }

        // Return the valid embeddings response
        return response.data.embeddings;
    } catch (error) {
        // Handle specific errors
        if (error.response && error.response.data && error.response.data.error) {
            console.error(`Error from autocompleteAPI: ${error.response.data.error}`);
        } else {
            console.error('Unexpected error fetching embeddings:', error.message);
        }

        // Fallback response
        return { embeddings: [] }; // Default fallback for embeddings
    }
}

async function fetchSearchedVideos(query) {
    try {
        const response = await axios.post(`${autocompleteAPI}/vector-search`, { query });
        return response.data;
    } catch (error) {
        console.error('Error fetching searched videos:', error);
        return [];
    }
}


async function fetchAutocompleteResults(query, userLanguage) {
    try {
        const response = await axios.get(`${autocompleteAPI}/autocomplete`, {
            params: { query, userLanguage }
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching autocomplete results for query "${query}":`, error.message);
        return [];
    }
}


async function fetchRecommendedVideos(videoId, transcript) {
    try {
        const response = await axios.post(`${autocompleteAPI}/get-recommended-videos`, {
            videoId,
            transcript
        });

        return response.data; // Return recommended videos
    } catch (error) {
        console.error(`Error fetching recommended videos for videoId "${videoId}":`, error.message);
        return { error: 'Failed to fetch recommended videos' };
    }
}


module.exports = { fetchVideoDetails, fetchCategoryDetails, fetchChannelDetails, fetchPredictedLabel, fetchKeywords, fetchTranscript, fetchEmbeddings, fetchSearchedVideos, fetchAutocompleteResults,fetchRecommendedVideos };
