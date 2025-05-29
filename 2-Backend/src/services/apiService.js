console.log('Constants:', require('../config/constants'));


const axios = require('axios');
const { youtubeAPI, apiKey, youtubeTranscriptAPI } = require('../config/constants');

async function fetchVideoDetails(videoId) {
    const response = await axios.get(`${youtubeAPI}/videos`, {
        params: { id: videoId, key: apiKey, part: 'snippet,contentDetails,statistics' }
    });
    return response.data.items[0];
}

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

module.exports = { fetchVideoDetails, fetchTranscript };
