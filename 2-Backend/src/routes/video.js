const express = require('express');
const { addVideo, deleteVideo, editVideo, searchVideo, autocomplete, recommendedVideos, updateVideoFields } = require('../controllers/videoController');
const checkAdminPassword = require('../middleware/checkAdminPassword');


const router = express.Router();



router.get('/search/', searchVideo);

router.get('/autocomplete/', autocomplete);

router.post('/recommendation', recommendedVideos);

// Admin routes
router.delete('/delete/:videoId', checkAdminPassword, deleteVideo);
router.put('/edit/:videoId', checkAdminPassword, editVideo);
router.put('/update-fields/', checkAdminPassword, updateVideoFields);

router.post('/add/:videoId', checkAdminPassword, addVideo);

module.exports = router;
