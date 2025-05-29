const axios = require('axios');
const { translationAPI } = require('../config/constants'); // Store the API URL in constants.js

async function translateText(word) {
    try {
        const response = await axios.get(`${translationAPI}/translate`, {
            params: { word }
        });

        return response.data; // Return the translated text
    } catch (error) {
        console.error(`Error translating text "${word}":`, error.message);
        return { error: 'Failed to fetch translation' };
    }
}

module.exports = {
    translateText
};
