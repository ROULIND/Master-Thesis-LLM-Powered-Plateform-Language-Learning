require('dotenv').config(); // Load environment variables

const config = {
    PORT: process.env.PORT || 3000, // Default to 3000 if PORT is not set
    apiKey: process.env.API_KEY,
    bucketName: process.env.GOOGLE_BUCKET_NAME,
    databaseFileName: process.env.DATABASE_FILE_NAME || 'database.json',
    statisticsFileName: process.env.STATISTICS_FILE_NAME || 'statistics.json',
    youtubeAPI: 'https://www.googleapis.com/youtube/v3',
    difficultyModelLink: process.env.DIFFICULTY_MODEL_URL,
    germanDifficultyModelLink: process.env.GERMAN_DIFFICULTY_MODEL_URL,
    autocompleteAPI: process.env.SEARCH_RECOMMENDATION_API_URL,
    youtubeTranscriptAPI: process.env.YOUTUBE_TRANSCRIPT_API_URL,
    elasticsearchHost: process.env.ELASTICSEARCH_HOST,
    elasticsearchIndex: process.env.ELASTICSEARCH_INDEX,
    elasticsearchUser: process.env.ELASTICSEARCH_USER,
    elasticsearchPassword: process.env.ELASTICSEARCH_PASSWORD,
    translationAPI: process.env.TRANSLATION_API_URL,
    adminPassword: process.env.ADMIN_PASSWORD
};

module.exports = config;
