const axios = require('axios');
const https = require('https'); // To allow Axios to handle self-signed certificates
const fs = require('fs');
const path = require('path');
const { Client } = require('@elastic/elasticsearch');
const { elasticsearchHost, elasticsearchIndex, elasticsearchUser, elasticsearchPassword } = require('../config/constants');
const { fetchAllVideos } = require('./storageService');
const { fetchEmbeddings } = require('./videoService');

// Initialize Elasticsearch client with authentication
const esClient = new Client({
    node: elasticsearchHost,
    auth: {
        username: elasticsearchUser,
        password: elasticsearchPassword
    },
    tls: {
        rejectUnauthorized: false // Ignore SSL certificate
    }
});

// Create a custom Axios instance with SSL disabled
const axiosInstance = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false, // Ignore self-signed certificates
    }),
    auth: {
        username: elasticsearchUser,
        password: elasticsearchPassword,
    },
});



// Add a video to Elasticsearch
async function addToElasticsearch(videoData, videoEmbeddings) {
    try {
        // Ensure transcript_embedding is a flat array, not an object with a nested key
        const flattenedEmbeddings = Array.isArray(videoEmbeddings.embeddings)
            ? videoEmbeddings.embeddings
            : videoEmbeddings;

        // Map the videoData object to match the Elasticsearch index structure
        const elasticsearchDocument = {
            video_id: videoData.videoId,
            publish_time: videoData.publishTime,
            title: videoData.videoTitle,
            channel_title: videoData.channelTitle,
            category_id: videoData.category,
            language: videoData.videoLanguage,
            views: videoData.statistics?.viewCount || "0", // Ensure fallback if not present
            likes: videoData.statistics?.likeCount || "0", // Ensure fallback if not present
            videoDifficulty: videoData.videoDifficulty,
            topics: videoData.videoKeywords?.videoTopics || [],
            subtopics: videoData.videoKeywords?.videoSubtopics || [],
            entities: videoData.videoKeywords?.videoEntities || [],
            transcript_embedding: flattenedEmbeddings // Ensure it's a flat array
        };

        console.log('Adding video to Elasticsearch:', elasticsearchDocument);

        // Send the document to Elasticsearch
        const response = await esClient.index({
            index: elasticsearchIndex,
            id: videoData.videoId, // Use videoId as the document ID
            body: elasticsearchDocument
        });

        console.log('Video successfully added to Elasticsearch:', response);
        return response;
    } catch (error) {
        console.error('Error adding video to Elasticsearch:', error.message);
        throw new Error('Elasticsearch update failed');
    }
}

async function updateToElasticsearch(videoId, updatedFields) {
    try {
        if (!videoId) {
            throw new Error('Invalid video ID');
        }
        
        console.log(`Updating Elasticsearch for video ID: ${videoId}`);

        if (typeof updatedFields !== "object" || updatedFields === null) {
            throw new Error("updatedFields must be an object");
        }

        // Mapping between database fields and Elasticsearch fields
        const dbToElasticMapping = {
            videoId: "video_id",
            publishTime: "publish_time",
            videoTitle: "title",
            channelTitle: "channel_title",
            category: "category_id",
            videoStatistics: {
                viewCount: "views",
                likeCount: "likes"
            },
            videoLanguage: "language",
            videoDifficulty: "videoDifficulty",
            videoKeywords: {
                videoTopics: "topics",
                videoSubtopics: "subtopics",
                videoEntities: "entities"
            },
            videoEmbeddings: "transcript_embedding"
        };

        let updateBody = { doc: {} };

        // Extract field names from updatedFields
        const fieldNames = Object.keys(updatedFields);

        fieldNames.forEach(field => {
            if (dbToElasticMapping[field]) {
                if (field === "videoStatistics") {
                    // Extract subfields from videoStatistics
                    updateBody.doc["views"] = updatedFields[field]?.viewCount || "0";
                    updateBody.doc["likes"] = updatedFields[field]?.likeCount || "0";
                } else if (field === "videoKeywords") {
                    // Extract subfields from videoKeywords
                    updateBody.doc["topics"] = updatedFields[field]?.videoTopics || [];
                    updateBody.doc["subtopics"] = updatedFields[field]?.videoSubtopics || [];
                    updateBody.doc["entities"] = updatedFields[field]?.videoEntities || [];
                } else {
                    // Direct field mapping
                    updateBody.doc[dbToElasticMapping[field]] = updatedFields[field];
                }
            }
        });

        if (Object.keys(updateBody.doc).length === 0) {
            console.log("No valid fields to update in Elasticsearch.");
            return { message: "No relevant fields to update in Elasticsearch" };
        }

        console.log('Updating Elasticsearch document with:', updateBody);

        // Send partial update to Elasticsearch
        const response = await esClient.update({
            index: elasticsearchIndex,
            id: videoId,
            body: updateBody
        });

        console.log('Video successfully updated in Elasticsearch:', response);
        return response;
    } catch (error) {
        console.error('Error updating video in Elasticsearch:', error.message);
        throw new Error('Elasticsearch update failed');
    }
}







// Delete video from Elasticsearch
async function deleteVideoFromElasticsearch(videoId) {
    try {
        // Send a DELETE request to Elasticsearch
        const response = await esClient.delete({
            index: elasticsearchIndex,
            id: videoId, // Use videoId as the document ID
        });

        console.log('Video successfully deleted from Elasticsearch:', response);
        return response;
    } catch (error) {
        // Handle errors (e.g., document not found)
        if (error.meta && error.meta.body && error.meta.body.found === false) {
            console.error(`Video with ID ${videoId} not found in Elasticsearch.`);
        } else {
            console.error('Error deleting video from Elasticsearch:', error.message);
        }
        throw new Error('Elasticsearch deletion failed');
    }
}


// Smart synchronization function using upsert to avoid duplicates
async function syncElasticsearchIndex() {
    try {

        // 1. Fetch all videos from the storage bucket
        const videos = await fetchAllVideos();
        console.log(`Fetched ${videos.length} videos from storage.`);

        // 2. Iterate over each video from the bucket
        for (const video of videos) {
            try {
                let transcript_embedding;
                // Use the exists API to check if the document is already in Elasticsearch
                const existsResponse = await esClient.exists({
                    index: elasticsearchIndex,
                    id: video.videoId,
                });

                if (existsResponse.body) {
                    // If the document exists, get the current document
                    const esResponse = await esClient.get({
                        index: elasticsearchIndex,
                        id: video.videoId,
                    });
                    const existingDoc = esResponse.body._source;

                    // If transcript_embedding is missing or empty, generate it
                    if (!existingDoc.transcript_embedding || (Array.isArray(existingDoc.transcript_embedding) && existingDoc.transcript_embedding.length === 0)) {
                        const embeddingResponse = await fetchEmbeddings(video.videoTranscript);
                        transcript_embedding = embeddingResponse.embeddings;
                    } else {
                        transcript_embedding = existingDoc.transcript_embedding;
                    }
                } else {
                    // Document does not exist: compute transcript embedding
                    const embeddingResponse = await fetchEmbeddings(video.videoTranscript);
                    transcript_embedding = embeddingResponse.embeddings;
                }

                // Build the document using the bucket data
                const newDoc = {
                    video_id: video.videoId,
                    publish_time: video.publishTime,
                    title: video.videoTitle,
                    channel_title: video.channelTitle,
                    category_id: video.category,
                    views: video.statistics?.viewCount || "0", // Fallback if not present
                    likes: video.statistics?.likeCount || "0",   // Fallback if not present
                    videoDifficulty: video.videoDifficulty,
                    topics: video.videoKeywords?.videoTopics || [],
                    subtopics: video.videoKeywords?.videoSubtopics || [],
                    entities: video.videoKeywords?.videoEntities || [],
                    transcript_embedding: transcript_embedding,
                };

                // Use update with upsert (doc_as_upsert: true) to either update or create the document
                await esClient.update({
                    index: elasticsearchIndex,
                    id: video.videoId,
                    body: {
                        doc: newDoc,
                        doc_as_upsert: true,
                    },
                });
                console.log(`Upserted video ${video.videoId} in Elasticsearch.`);
            } catch (error) {
                console.error(`Error processing video ${video.videoId}: ${error.message}`);
            }
        }
        console.log("Elasticsearch synchronization complete.");
    } catch (error) {
        console.error("Error during Elasticsearch synchronization:", error.message);
    }
}




/**
 * Backs up an Elasticsearch index by saving its mappings and data in Bulk API format.
 * @param {string} indexName - The name of the Elasticsearch index to back up.
 * @param {string} backupDir - The directory to save the backup files.
 */
async function backupIndex(indexName, backupDir) {
    try {
        // Ensure the backup directory exists
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }

        console.log(`Starting backup for index: ${indexName}`);

        // Get the formatted date
        const formattedDate = getFormattedDate();

        // Step 1: Fetch and save the index mapping
        const mappingResponse = await axiosInstance.get(`${elasticsearchHost}${indexName}/_mapping`);
        const mappingFilePath = path.join(backupDir, `backup-elasticsearch-mapping_${formattedDate}.json`);
        fs.writeFileSync(mappingFilePath, JSON.stringify(mappingResponse.data, null, 2));
        console.log(`Index mapping saved to ${mappingFilePath}`);

        // Step 2: Fetch data and save in Bulk API format
        const bulkFilePath = path.join(backupDir, `backup-elasticsearch-data_${formattedDate}.json`);
        const initialResponse = await axiosInstance.post(`${elasticsearchHost}${indexName}/_search?scroll=1m`, {
            query: { match_all: {} },
            size: 1000,
        });

        let scrollId = initialResponse.data._scroll_id;
        let hits = initialResponse.data.hits.hits;

        // Write the first batch of data in Bulk API format
        saveHitsInBulkFormat(hits, bulkFilePath, indexName);

        // Fetch and append the rest of the data
        while (scrollId) {
            console.log(`Fetching next scroll batch for index: ${indexName}`);
            const scrollResponse = await axiosInstance.post(`${elasticsearchHost}_search/scroll`, {
                scroll: '1m',
                scroll_id: scrollId,
            });

            hits = scrollResponse.data.hits.hits;
            if (hits.length === 0) break;

            saveHitsInBulkFormat(hits, bulkFilePath, indexName);
            scrollId = scrollResponse.data._scroll_id;
        }

        console.log(`Backup completed successfully for index: ${indexName}`);
    } catch (error) {
        // Log the full error response for debugging
        if (error.response) {
            console.error(`Error backing up index ${indexName}:`, error.response.status, error.response.data);
        } else {
            console.error(`Error backing up index ${indexName}:`, error.message);
        }
    }
}

/**
 * Saves Elasticsearch hits in Bulk API format to a file.
 * @param {Array} hits - The data hits from Elasticsearch.
 * @param {string} filePath - The file path to save the data.
 * @param {string} indexName - The name of the Elasticsearch index.
 */
function saveHitsInBulkFormat(hits, filePath, indexName) {
    const bulkData = hits
        .map((doc) => {
            const action = JSON.stringify({
                index: { _index: indexName, _id: doc._id },
            });
            const source = JSON.stringify(doc._source);
            return `${action}\n${source}`;
        })
        .join('\n');

    // Append the data to the file
    fs.appendFileSync(filePath, bulkData + '\n');
    console.log(`Appended ${hits.length} records to ${filePath}`);
}

/**
 * Get today's date formatted as yyyy_mm_dd.
 * @returns {string} - The formatted date.
 */
function getFormattedDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}_${month}_${day}`;
}

/**
 * Restores data from a backup file into a specific Elasticsearch index.
 * @param {string} filePath - The path to the backup file in Bulk API format.
 * @param {string} indexName - The Elasticsearch index to restore the data into.
 */
async function restoreData(filePath, indexName) {
    try {
        // Check if the backup file exists
        if (!fs.existsSync(filePath)) {
            throw new Error(`Backup file not found at: ${filePath}`);
        }

        console.log(`Starting data restore for index: ${indexName} from file: ${filePath}`);

        // Read the backup file
        const bulkData = fs.readFileSync(filePath, 'utf-8');

        // Validate the data
        if (!bulkData.trim()) {
            throw new Error(`Backup file is empty: ${filePath}`);
        }

        // Send the data to Elasticsearch using the Bulk API
        const response = await esClient.bulk({ body: bulkData });

        if (response.errors) {
            // Log details of failed operations
            const failedItems = response.items.filter((item) => item.index && item.index.error);
            console.error('Some documents failed to restore:', failedItems);
            throw new Error('Errors occurred during the restore process. Check the logs for details.');
        }

        console.log(`Data restored successfully to index: ${indexName}`);
    } catch (error) {
        console.error(`Error restoring data to index ${indexName}:`, error.message);
        throw error;
    }
}




module.exports = { addToElasticsearch, deleteVideoFromElasticsearch, backupIndex, restoreData, syncElasticsearchIndex, updateToElasticsearch };
