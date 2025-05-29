const storage = require('../config/googleCloud');
const { bucketName, databaseFileName, statisticsFileName } = require('../config/constants');

//////////////////////////////////////////////////////
//                 Video Bucket                     //
//////////////////////////////////////////////////////


// Fetch all videos from the storage
async function fetchAllVideos() {
    const file = storage.bucket(bucketName).file(databaseFileName);
    const [data] = await file.download();
    return JSON.parse(data.toString());
}

// Fetch a single video by ID
async function fetchVideoById(videoId) {
    const videos = await fetchAllVideos();
    return videos.find(video => video.videoId === videoId);
}

// Save the content to the storage
async function saveFileContent(content) {
    const file = storage.bucket(bucketName).file(databaseFileName);
    await file.save(JSON.stringify(content), { contentType: 'application/json' });
}

// Save video information to the database
async function saveToDatabase(videoInfo) {
    const file = storage.bucket(bucketName).file(databaseFileName);

    // Ensure file exists
    const [exists] = await file.exists();
    if (!exists) {
        await file.save('[]', { contentType: 'application/json' });
    }

    // Update database
    const [data] = await file.download();
    const currentData = JSON.parse(data.toString());
    currentData.push(videoInfo);
    await file.save(JSON.stringify(currentData), { contentType: 'application/json' });
}


// Delete a video from the database
async function deleteVideoFromDatabase(videoId) {
    const file = storage.bucket(bucketName).file(databaseFileName);

    // Download the current database
    const [data] = await file.download();
    const searchResults = JSON.parse(data.toString());

    // Find and filter out the video
    const deletedVideo = searchResults.find(video => video.videoId === videoId);
    if (!deletedVideo) return null;

    const updatedResults = searchResults.filter(video => video.videoId !== videoId);

    // Save the updated database
    await file.save(JSON.stringify(updatedResults), { contentType: 'application/json' });

    return deletedVideo;
}


// Edit a video in the database
async function editVideoFromDatabase(videoId, updatedVideoData) {
    const file = storage.bucket(bucketName).file(databaseFileName);

    // Download the current database
    const [data] = await file.download();
    const videos = JSON.parse(data.toString());

    // Find and update the specific video
    let videoFound = false;
    const updatedVideos = videos.map(video => {
        if (video.videoId === videoId) {
            videoFound = true;
            return { ...video, ...updatedVideoData }; // Merge the updates with the existing video data
        }
        return video;
    });

    if (!videoFound) {
        throw new Error(`Video with ID ${videoId} not found`);
    }

    // Save the updated videos back to the database
    await file.save(JSON.stringify(updatedVideos), { contentType: 'application/json' });

    return { videoId, ...updatedVideoData };
}

// Utility function for batching database updates
async function batchUpdateVideosInDatabase(batchUpdates) {
    const file = storage.bucket(bucketName).file(databaseFileName);

    // Download the current database
    const [data] = await file.download();
    const videos = JSON.parse(data.toString());

    // Update videos in memory
    const updatedVideos = videos.map(video => {
        const update = batchUpdates.find(u => u.id === video.videoId);
        return update ? { ...video, ...update.updatedVideoData } : video;
    });

    // Save the updated database in a single operation
    await file.save(JSON.stringify(updatedVideos), { contentType: 'application/json' });
}



//////////////////////////////////////////////////////
//              Statistics Bucket                   //
//////////////////////////////////////////////////////




// Update statistics after deletion
async function updateStatisticsAfterDeletion(videoId) {
    const file = storage.bucket(bucketName).file(statisticsFileName);

    // Ensure the statistics file exists
    const [statisticsData] = await file.download().catch(() => {
        const initData = JSON.stringify({ DateInformation: [] });
        return file.save(initData, { contentType: 'application/json' }).then(() => [Buffer.from(initData)]);
    });

    const statistics = JSON.parse(statisticsData.toString());

    // Add a deletion entry
    const formattedDate = new Date().toLocaleDateString();
    statistics.DateInformation.push({
        videoId,
        dateDeleted: formattedDate
    });

    // Save updated statistics
    await file.save(JSON.stringify(statistics), { contentType: 'application/json' });
}

// Update statistics
async function updateStatistics(videoId) {
    const file = storage.bucket(bucketName).file(statisticsFileName);

    // Ensure file exists
    const [statisticsData] = await file.download().catch(() => {
        return file.save('{}', { contentType: 'application/json' }).then(() => [Buffer.from('{}')]);
    });

    const stats = JSON.parse(statisticsData.toString());
    stats.DateInformation = stats.DateInformation || [];
    stats.DateInformation.push({ videoId, dateAdded: new Date().toLocaleDateString() });

    await file.save(JSON.stringify(stats), { contentType: 'application/json' });
}

const getStatisticsData = async () => {
    try {
        const statisticsFile = storage.bucket(bucketName).file(statisticsFileName);
        const [statisticsData] = await statisticsFile.download();
        return JSON.parse(statisticsData.toString());
    } catch (error) {
        console.error('Error fetching statistics:', error);
        throw new Error('Failed to fetch statistics data');
    }
};

module.exports = {
    saveFileContent,
    fetchAllVideos,
    fetchVideoById,
    saveToDatabase,
    updateStatistics,
    deleteVideoFromDatabase,
    updateStatisticsAfterDeletion,
    editVideoFromDatabase, // Export the new function
    getStatisticsData,
    batchUpdateVideosInDatabase, // Export the new function
};
