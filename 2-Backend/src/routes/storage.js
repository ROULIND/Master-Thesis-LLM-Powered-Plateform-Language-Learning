const express = require('express');
const { getAllVideos, getVideoById } = require('../controllers/storageController');

const router = express.Router();

// Route to fetch all videos from the database
router.get('/videos', getAllVideos);
router.get('/videos/:videoId', getVideoById);


module.exports = router;
