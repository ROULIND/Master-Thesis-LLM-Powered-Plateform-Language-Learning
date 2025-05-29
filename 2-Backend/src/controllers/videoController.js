const { fetchVideoDetails, fetchCategoryDetails, fetchChannelDetails, fetchPredictedLabel, fetchKeywords, fetchTranscript, fetchEmbeddings, fetchSearchedVideos, fetchAutocompleteResults, fetchRecommendedVideos } = require('../services/videoService');
const { saveToDatabase, updateStatistics, deleteVideoFromDatabase, updateStatisticsAfterDeletion, editVideoFromDatabase, fetchVideoById, fetchAllVideos, batchUpdateVideosInDatabase } = require('../services/storageService');
const { addToElasticsearch, deleteVideoFromElasticsearch, updateToElasticsearch } = require('../services/elasticsearchService');
const { determineDifficultyColor, formatDuration, formatViewCount } = require('../helpers/videoUtils');
const { calculateRelativeDate } = require('../helpers/dateUtils');
const { tr } = require('date-fns/locale/tr');
const { format } = require('date-fns/format');

// Add a video to the database
async function addVideo(req, res) {
    const videoId = req.params.videoId;

    try {
        if (!videoId) {
            return res.status(400).json({ error: 'Invalid video ID' });
        }
        console.log("Adding video with ID: " + videoId);
        const videoData = await fetchVideoDetails(videoId);
        const categoryData = await fetchCategoryDetails(videoData.snippet.categoryId);
        if (videoData) {console.log("Video data fetched successfully");}

        let videoLanguage = videoData.snippet.defaultAudioLanguage || 'en';
        videoLanguage = videoLanguage.split('-')[0];
        console.log("Video Language: " + videoLanguage);

        // Fetch channel details to obtain the channel image if needed
        const channelDetails = await fetchChannelDetails(videoData.snippet.channelId);
        const channelImage = channelDetails?.thumbnails?.default?.url || '';

        const transcript = await fetchTranscript(videoId, videoLanguage);
        if (transcript) {console.log("Transcript fetched successfully");}
        else {
            return res.status(400).json({ error: 'Video does not have a transcript' });
        }

        const predicted_label = await fetchPredictedLabel(videoId, transcript, videoLanguage);
        if (predicted_label) {console.log("Predicted label fetched successfully:" + predicted_label);}
        else {
            return res.status(400).json({ error: 'Video does not have a predicted label' });
        }
        
        const difficultyColor = determineDifficultyColor(predicted_label);


        const keywordsData = await fetchKeywords(transcript);
        if (keywordsData) {console.log("Keywords fetched successfully" + keywordsData);}
        else {
            return res.status(400).json({ error: 'Video does not have keywords' });
        }

        const videoEmbbedings = await fetchEmbeddings(transcript);
        if (videoEmbbedings) {console.log("Embeddings fetched successfully");}
        else {
            return res.status(400).json({ error: 'Video does not have embeddings' });
        }

        // Retrieve the video’s content details to extract the duration
        // (Assuming your fetchVideoDetails already includes contentDetails;
        //  otherwise, add a separate call like: const contentDetails = await fetchContentDetails(videoId);)
        const contentDetails = videoData.contentDetails;
        if (!contentDetails || !contentDetails.duration) {
            return res.status(400).json({ error: 'Video does not have content details' });
        }

        // Retrieve video statistics (view count, like count, comment count)
        const videoStatistics = videoData.statistics;
        if (!videoStatistics) {
            return res.status(400).json({ error: 'Video does not have statistics' });
        }

        

        // Build the videoInfo object with all the required data
        const videoInfo = {
            videoTitle: videoData.snippet.title,
            videoId,
            thumbnail: videoData.snippet.thumbnails.high.url,
            publishTime: videoData.snippet.publishedAt,
            channelId: videoData.snippet.channelId,
            channelTitle: videoData.snippet.channelTitle,
            channelImage: channelImage,  // Newly added: channel image
            category: categoryData.title,
            videoLanguage: videoLanguage,
            videoDifficulty: predicted_label,
            videoTranscript: transcript,
            videoDifficultyColor: difficultyColor,
            videoDuration: formatDuration(contentDetails.duration),  // Use contentDetails.duration
            videoChecked: 0,
            videoKeywords: keywordsData,
            videoStatistics: {
                viewCount: formatViewCount(videoStatistics.viewCount),
                likeCount: formatViewCount(videoStatistics.likeCount),
                commentCount: formatViewCount(videoStatistics.commentCount)
            },
            videoDescription: videoData.snippet.description  // Newly added: video description
        };

        console.log("Video Info: " + videoInfo);

        // Save the video to the database
        await saveToDatabase(videoInfo);
        // Update statistics file
        await updateStatistics(videoId);
        // Save the video to Elasticsearch
        await addToElasticsearch(videoInfo, videoEmbbedings);

        res.json({ message: 'Video added successfully' });
    } catch (error) {
        console.error('Error adding video:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Delete a video from the database
async function deleteVideo(req, res) {
    const videoId = req.params.videoId;

    try {
        // Delete video from the database
        const deletedVideo = await deleteVideoFromDatabase(videoId);
        if (!deletedVideo) {
            console.log(`Video with ID ${videoId} not found.`);
            return res.status(404).json({ error: 'Video not found' });
        }

        // Update statistics
        await updateStatisticsAfterDeletion(videoId);

        // Attempt to delete from Elasticsearch, but don't block the process if not found
        try {
            await deleteVideoFromElasticsearch(videoId);
        } catch (error) {
            console.warn(`Skipping Elasticsearch deletion due to error: ${error.message}`);
        }

        res.json({ message: 'Video deleted successfully' });
    } catch (error) {
        console.error('Error deleting video:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


// Edit video details
async function editVideo (req, res) {
    const videoIdToEdit = req.params.videoId;
    const updatedVideoData = req.body;

    try {
        // Delegate the actual editing logic to a service
        await editVideoFromDatabase(videoIdToEdit, updatedVideoData);
        console.log('Video edited.');
        res.json({ message: 'Video edited successfully' });
    } catch (error) {
        console.error('Error editing video:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


// Search for videos
async function searchVideo(req, res) {
    const query = req.query.query;

    try {
        const searchResults = await fetchSearchedVideos(query);
        res.json(searchResults);
    } catch (error) {
        console.error('Error searching videos:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Autocomplete functionality for search
const autocomplete = async (req, res) => {
    try {
        const query = req.query.query;
        const userLanguage = req.query.userLanguage;
        if (!query) {
            return res.status(400).json({ error: 'Query parameter is required' });
        }

        const results = await fetchAutocompleteResults(query, userLanguage);
        res.json(results);
    } catch (error) {
        console.error('Error in autocomplete:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


// Recommended videos
const recommendedVideos = async (req, res) => {
    const { videoId, transcript } = req.body;

    try {
        const recommendedVideos = await fetchRecommendedVideos(videoId, transcript);
        res.json(recommendedVideos);
    } catch (error) {
        console.error('Error fetching recommended videos:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



const updateVideoFields = async (req, res) => {
    let { videoId, fieldsToUpdate } = req.body;

    try {
        // Validate `fieldsToUpdate`
        if (!Array.isArray(fieldsToUpdate) || fieldsToUpdate.length === 0) {
            return res.status(400).json({ error: 'fieldsToUpdate must be a non-empty array' });
        }

        let videoIds = [];

        // Handle different cases for `videoId`
        if (videoId === "allVideoId") {
            const allVideos = await fetchAllVideos();
            videoIds = allVideos.map(video => video.videoId);
        } else if (Array.isArray(videoId)) {
            videoIds = videoId;
        } else if (typeof videoId === "string") {
            videoIds = [videoId];
        } else {
            return res.status(400).json({ error: 'Invalid video ID format' });
        }

        if (videoIds.length === 0) {
            return res.status(404).json({ error: 'No videos found to update' });
        }

        console.log(`Updating ${videoIds.length} videos in batches...`);

        let updatedVideos = [];
        const batchSize = 10; // Limit updates to 10 videos per batch
        const delayMs = 200;  // Delay of 200ms between batches

        for (let i = 0; i < videoIds.length; i += batchSize) {
            const batch = videoIds.slice(i, i + batchSize);
            console.log(`Processing batch ${i / batchSize + 1}: ${batch}`);

            let batchUpdates = []; // Store updates for batch processing

            for (const id of batch) {
                console.log(`Updating video with ID: ${id}`);

                const existingVideoData = await fetchVideoById(id);
                if (!existingVideoData) {
                    console.warn(`Video ID ${id} not found in database, skipping.`);
                    continue;
                }

                let updatedFields = {}; 
                let videoData = await fetchVideoDetails(id);
                if (!videoData) {
                    console.warn(`Video ID ${id} not found in YouTube API, skipping.`);
                    continue;
                }

                // Update requested fields
                for (const field of fieldsToUpdate) {
                    try {
                        switch (field) {
                            case "category":
                                const categoryData = await fetchCategoryDetails(videoData.snippet.categoryId);
                                updatedFields.category = categoryData?.title || existingVideoData.category;
                                break;
                            case "videoLanguage":
                                let videoLanguage = videoData.snippet.defaultAudioLanguage || 'en';
                                updatedFields.videoLanguage = videoLanguage.split('-')[0];
                                break;
                            case "channelImage":
                                console.log("Fetching channel image for video ID:", id);
                                const channelDetails = await fetchChannelDetails(videoData.snippet.channelId);
                                updatedFields.channelImage = channelDetails?.thumbnails?.default?.url || '';
                                break;
                            case "videoTranscript":
                                const transcript = await fetchTranscript(id, existingVideoData.videoLanguage);
                                if (!transcript) {
                                    console.warn(`Video ID ${id} does not have a transcript, skipping this field.`);
                                    continue;
                                }
                                updatedFields.videoTranscript = transcript;
                                break;

                            case "publishTime":
                                updatedFields.publishTime = videoData.snippet.publishedAt
                                break;

                            case "videoDifficulty":
                                const transcriptForDifficulty = updatedFields.videoTranscript || existingVideoData.videoTranscript;
                                if (!transcriptForDifficulty) continue;
                                const predicted_label = await fetchPredictedLabel(id, transcriptForDifficulty, existingVideoData.videoLanguage);
                                if (!predicted_label) continue;
                                updatedFields.videoDifficulty = predicted_label;
                                updatedFields.videoDifficultyColor = determineDifficultyColor(predicted_label);
                                break;
                            case "videoKeywords":
                                const transcriptForKeywords = updatedFields.videoTranscript || existingVideoData.videoTranscript;
                                if (!transcriptForKeywords) continue;
                                const keywordsData = await fetchKeywords(transcriptForKeywords);
                                if (!keywordsData) continue;
                                updatedFields.videoKeywords = keywordsData;
                                break;
                            case "videoEmbeddings":
                                const transcriptForEmbeddings = updatedFields.videoTranscript || existingVideoData.videoTranscript;
                                if (!transcriptForEmbeddings) continue;
                                const videoEmbeddings = await fetchEmbeddings(transcriptForEmbeddings);
                                if (!videoEmbeddings) continue;
                                updatedFields.videoEmbeddings = videoEmbeddings;
                                break;
                            case "videoDuration":
                                updatedFields.videoDuration = formatDuration(videoData?.contentDetails?.duration || existingVideoData.videoDuration);
                                break;
                            case "videoStatistics":
                                updatedFields.videoStatistics = {
                                    viewCount: formatViewCount(videoData?.statistics?.viewCount || existingVideoData.videoStatistics.viewCount),
                                    likeCount: formatViewCount(videoData?.statistics?.likeCount || existingVideoData.videoStatistics.likeCount),
                                    commentCount: formatViewCount(videoData?.statistics?.commentCount || existingVideoData.videoStatistics.commentCount)
                                };
                                break;
                            default:
                                console.warn(`Skipping unknown field: ${field}`);
                        }
                    } catch (error) {
                        console.error(`Error updating field ${field} for Video ID ${id}:`, error.message);
                    }
                }

                console.log(`Updated fields for Video ID ${id}:`, updatedFields);

                if (Object.keys(updatedFields).length > 0) {
                    const updatedVideoData = { ...existingVideoData, ...updatedFields };
                    batchUpdates.push({ id, updatedVideoData, updatedFields });
                }
            }

            // Perform batch update in database
            if (batchUpdates.length > 0) {
                await batchUpdateVideosInDatabase(batchUpdates);
                console.log(`Batch ${i / batchSize + 1} saved to database.`);
            }

            // Perform batch update in Elasticsearch
            for (const update of batchUpdates) {
                await updateToElasticsearch(update.id, update.updatedFields);
            }

            updatedVideos.push(...batchUpdates.map(update => ({
                videoId: update.id,
                updatedFields: update.updatedFields
            })));

            console.log(`Batch ${i / batchSize + 1} completed. Waiting ${delayMs}ms before next batch...`);
            await sleep(delayMs);
        }

        return res.json({ message: "Videos updated successfully", updatedVideos });
    } catch (error) {
        console.error('Error updating videos:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};



// Utility function to introduce a delay
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}







module.exports = { addVideo, deleteVideo, editVideo, searchVideo, autocomplete, recommendedVideos, updateVideoFields };
