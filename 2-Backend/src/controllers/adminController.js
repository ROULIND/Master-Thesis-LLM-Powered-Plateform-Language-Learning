const { backupIndex, restoreData, syncElasticsearchIndex } = require('../services/elasticsearchService');
const { getStatisticsData } = require('../services/storageService');

async function backupElasticsearchIndex(req, res) {
    const { indexName, backupDir } = req.body;

    try {
        if (!indexName || !backupDir) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        await backupIndex(indexName, backupDir);
        res.json({ message: 'Index backup completed successfully' });
    } catch (error) {
        console.error('Error backing up index:', error);
        res.status(500).json({ error: 'An error occurred while backing up the index' });
    }
}

async function restoreElasticsearchIndex(req, res) {
    const { indexName, backupDir } = req.body;

    try {
        if (!indexName || !backupDir) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        await restoreData(backupDir, indexName);
        res.json({ message: 'Index restore completed successfully' });
    } catch (error) {
        console.error('Error restoring index:', error);
        res.status(500).json({ error: 'An error occurred while restoring the index' });
    }
}


async function getStatistics(req, res) {
    try {
        const statistics = await getStatisticsData(); // Call the service function
        res.json(statistics); // Send the statistics as a JSON response
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({ error: 'Internal Server Error' }); // Return a 500 error response
    }
}

// Force sync the Elasticsearch index with the database
async function synchronizeElastiSearchIndex(req, res) {
    try {
        await syncElasticsearchIndex();
        res.json({ message: 'Elasticsearch index synced successfully' });
    } catch (error) {
        console.error('Error syncing Elasticsearch index:', error);
        res.status(500).json({ error: 'An error occurred while syncing the Elasticsearch index' });
    }
}

module.exports = { backupElasticsearchIndex, restoreElasticsearchIndex, getStatistics, synchronizeElastiSearchIndex };