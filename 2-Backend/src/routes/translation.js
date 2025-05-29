const express = require('express');
const { translate } = require('../controllers/translationController');

const router = express.Router();

router.get('/translate', translate);

module.exports = router;
