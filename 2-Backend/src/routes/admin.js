const express = require('express');
const { backupElasticsearchIndex, restoreElasticsearchIndex, getStatistics, synchronizeElastiSearchIndex } = require('../controllers/adminController');

const router = express.Router();

// Route to backup an Elasticsearch index
router.post('/backupElasticsearchIndex', backupElasticsearchIndex);

// Route to restore an Elasticsearch index
router.post('/restoreElasticsearchIndex', restoreElasticsearchIndex);

// Route to get statistics
router.get('/statistics', getStatistics);

// Route to sync the Elasticsearch index
router.post('/syncElasticsearchIndex', synchronizeElastiSearchIndex);

module.exports = router;
