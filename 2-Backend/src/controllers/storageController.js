const { fetchAllVideos, fetchVideoById } = require('../services/storageService');


async function getAllVideos(req, res) {
    try {
        const searchResults = await fetchAllVideos(); // Call the service function
        res.json(searchResults); // Send the content as a JSON response
    } catch (error) {
        console.error('Error fetching storage content:', error);
        res.status(500).json({ error: 'Internal Server Error' }); // Return a 500 error response
    }
}

async function getVideoById(req, res) {
    const videoId = req.params.videoId; // Extract the video ID from the request

    try {
        const video = await fetchVideoById(videoId); // Call the service function
        if (video) {
            res.json(video); // Send the video as a JSON response
        } else {
            res.status(404).json({ error: 'Video not found' }); // Return a 404 error response
        }
    } catch (error) {
        console.error('Error fetching video:', error);
        res.status(500).json({ error: 'Internal Server Error' }); // Return a 500 error response
    }
}

module.exports = { getAllVideos, getVideoById,  };
