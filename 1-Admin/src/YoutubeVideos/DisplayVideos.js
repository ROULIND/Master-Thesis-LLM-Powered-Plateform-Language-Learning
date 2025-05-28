import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DialogComponent from './Components/DialogComponent';
import TableComponent from './Components/TableComponent';
import ProgessBarComponent from './Components/CircularProgressComponent';
import UpdateComponent from './Components/UpdateComponent';

const autocompleteURL = process.env.REACT_APP_AUTOCOMPLETE_URL;

const CrudTable = () => {

    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const openUpdate = () => setIsUpdateOpen(true);
    const closeUpdate = () => setIsUpdateOpen(false);



    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editedVideo, setEditedVideo] = useState(null);
    const [url, setUrl] = useState('');
    const [videos, setVideos] = useState([]);
    const [videoKeywords, setVideoKeywords] = useState({
        videoTopics: [],
        videoSubtopics: [],
        videoEntities: []
    });
    const apiUrl = process.env.REACT_APP_API_URL;
    const [searchQuery, setSearchQuery] = useState('');
    const [videoTitle, setVideoTitle] = useState('');
    const [videoId, setVideoId] = useState('');
    const [thumbnail, setThumbnail] = useState('');
    const [publishTime, setPublishTime] = useState('');
    const [channelId, setChannelId] = useState('');
    const [channelTitle, setChannelTitle] = useState('');
    const [category, setCategory] = useState('');
    const [videoDifficulty, setVideoDifficulty] = useState('');
    const [videoDescription, setVideoDescription] = useState('');
    const [videoTranscript, setVideoTranscript] = useState('');

    useEffect(() => {
        axios.get(`${apiUrl}/storage/videos/`)
            .then(response => {
                setVideos(response.data);
            })
            .catch(error => {
                console.error('Error fetching videos:', error);
            });
    }, []);

    const handleDialogOpen = () => {
        setIsDialogOpen(true);
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
    };

    const fetchVideos = async () => {
        try {
            const response = await fetch(`${apiUrl}/storage/videos/`);
            const data = await response.json();
            setVideos(data);
        } catch (error) {
            console.error('Error fetching videos:', error);
        }
    };

    const handleAddVideo = async () => {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('type', type);
        formData.append('url', url);

        try {
            const response = await fetch('/api/videos', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                await fetchVideos();
                setTitle('');
                setDescription('');
                setType('');
                setUrl('');
                setIsDialogOpen(false);
            } else {
                console.error('Error adding video');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };



    const handleUpdateVideo = async () => {
        try {
            if (!editedVideo) {
                console.error('No video to update');
                return;
            }
            const updatedVideoData = {
                searchQuery: `${searchQuery}`,
                videoTitle: `${videoTitle}`,
                videoId: `${editedVideo.videoId}`,
                thumbnail: `${thumbnail}`,
                publishTime: `${publishTime}`,
                channelId: `${channelId}`,
                channelTitle: `${channelTitle}`,
                category: `${category}`,
                videoDifficulty: `${videoDifficulty}`,
                videoDescription: `${videoDescription}`,
                videoTranscript: `${videoTranscript}`,
                videoKeywords: {
                    videoTopics: videoKeywords.videoTopics || [],
                    videoSubtopics: videoKeywords.videoSubtopics || [],
                    videoEntities: videoKeywords.videoEntities || []
                }
            };

            const response = await fetch(
                `${apiUrl}/video/edit/${editedVideo.videoId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-admin-password': process.env.REACT_APP_ADMIN_PASSWORD
                    },
                    body: JSON.stringify(updatedVideoData),
                }
            );

            if (response.ok) {
                console.log('Video updated successfully');
                await fetchVideos();
                setIsDialogOpen(false);
            } else {
                const errorText = await response.text();
                console.error('Error updating video:', errorText);
            }
        } catch (error) {
            console.error('Error updating video:', error);
        }
    };


    const handleEditVideo = (video) => {
        setEditedVideo(video);
        setSearchQuery(video.searchQuery);
        setVideoTitle(video.videoTitle);
        setVideoId(video.videoId);
        setThumbnail(video.thumbnail);
        setPublishTime(video.publishTime);
        setChannelId(video.channelId);
        setChannelTitle(video.channelTitle);
        setCategory(video.category);
        setVideoDifficulty(video.videoDifficulty);
        setVideoDescription(video.videoDescription);
        setVideoTranscript(video.videoTranscript);
        setVideoKeywords({
            videoTopics: video.videoKeywords?.videoTopics || [],
            videoSubtopics: video.videoKeywords?.videoSubtopics || [],
            videoEntities: video.videoKeywords?.videoEntities || []
        });
        setIsDialogOpen(true);
    };

    const handleDeleteVideo = async (video) => {
        const isConfirmed = window.confirm('Are you sure to delete this video?');
        if (!isConfirmed) {
            return;
        }

        try {
            const response = await fetch(
                `${apiUrl}/video/delete/${video.videoId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'x-admin-password': process.env.REACT_APP_ADMIN_PASSWORD
                    }
                }
            );

            if (response.ok) {
                console.log('Video deleted successfully from the main database.');
                // Fetch updated video list
                await fetchVideos();
            } else {
                const errorText = await response.text();
                console.error('Error deleting video from the main database:', errorText);
                // Optionally show an error dialog to user
            }
        } catch (error) {
            console.error('Error deleting video:', error);
            // Optionally show an error dialog to user
        }
    };

    

    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate(-1);
    };

    useEffect(() => {
        fetchVideos();
    }, []);

    const categories = ['Autos & Vehicles', 'Film & Animation', 'Music', 'Pets & Animals', 'Sports', 'Short Movies', 'Travel & Events', 'Gaming', 'Videoblogging', 'People & Blogs', 'Comedy', 'Music', 'Entertainment', 'News & Politics', 'Howto & Style', 'Education', 'Science & Technology', 'Nonprofits & Activism', 'Movies', 'Anime/Animation', 'Action/Adventure', 'Classics', 'Comedy', 'Documentary', 'Drama', 'Family', 'Foreign', 'Horror', 'Comedy', 'Sci-Fi/Fantasy', 'Thriller', 'Shorts', 'Shows', 'Trailers'];

    // Add a new state for progress
    const [progress, setProgress] = useState(0);

    const generateNewKeywordsForAllVideos = async () => {
        try {
            const videosWithoutKeywords = videos.filter(video => 
                !video.videoKeywords || 
                !video.videoKeywords.videoTopics.length ||
                !video.videoKeywords.videoSubtopics.length
            );
    
            console.log('Videos without keywords:', videosWithoutKeywords[0]);
            
            const totalVideos = videosWithoutKeywords.length;
            if (totalVideos === 0) {
                console.log('All videos already have keywords.');
                return;
            }
    
            for (let i = 0; i < totalVideos; i++) {
                const video = videosWithoutKeywords[i];
                console.log(`Generating keywords for video ${video.videoTitle}...`);
    
                // Call the autocomplete URL service to generate keywords
                const response = await axios.post(`${autocompleteURL}/get-video-keywords`, {
                    transcript: video.videoTranscript
                });
                await new Promise(resolve => setTimeout(resolve, 15000));
                const newKeywords = response.data;
                console.log('New keywords:', newKeywords);
                await new Promise(resolve => setTimeout(resolve, 15000));
                // Construct updated video data directly
                const updatedVideoData = {
                    searchQuery: video.searchQuery,
                    videoTitle: video.videoTitle,
                    videoId: video.videoId,
                    thumbnail: video.thumbnail,
                    publishTime: video.publishTime,
                    channelId: video.channelId,
                    channelTitle: video.channelTitle,
                    category: video.category,
                    videoDifficulty: video.videoDifficulty,
                    videoDescription: video.videoDescription,
                    videoTranscript: video.videoTranscript,
                    videoKeywords: {
                        videoTopics: newKeywords.videoTopics || [],
                        videoSubtopics: newKeywords.videoSubtopics || [],
                        videoEntities: newKeywords.videoEntities || []
                    }
                };
    
                // Send the PUT request to update the video in the database
                const updateResponse = await fetch(`${apiUrl}/admin/edit-video/${video.videoId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedVideoData),
                });
    
                if (updateResponse.ok) {
                    console.log(`Video ${video.videoTitle} updated successfully.`);
                } else {
                    console.error(`Error updating video ${video.videoTitle}`);
                }
    
                // Update progress
                setProgress(Math.round(((i + 1) / totalVideos) * 100));
    
                // Delay of 15 seconds before processing the next video
                await new Promise(resolve => setTimeout(resolve, 7000));
                //break; // Remove this line to process all videos
            }
    
            console.log('All videos updated with new keywords.');
        } catch (error) {
            console.error('Error generating keywords:', error);
        } finally {
            setProgress(0); // Reset progress after completion
        }
    };
    




    

    return (
        <div>
            <div style={{ background: 'white', padding: '10px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Button color="primary" startIcon={<ArrowBackIcon style={{ color: '#1d2a40' }} />} onClick={handleGoBack}>
                    <span style={{ color: '#1d2a40' }}>Back</span>
                </Button>
                <Typography variant="h5" style={{ color: 'white' }}>
                    <span style={{ color: '#1d2a40' }}>Videos</span>
                </Typography>
                <div></div>
            </div>
            <div style={{ padding: '20px', background: '#1d2a40', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ color: 'white' }}>Videos</h2>
            </div>
            <DialogComponent
                isDialogOpen={isDialogOpen}
                handleDialogClose={() => setIsDialogOpen(false)}
                editedVideo={editedVideo}
                handleAddVideo={handleAddVideo}
                handleUpdateVideo={handleUpdateVideo}
                videoTitle={videoTitle}
                setVideoTitle={setVideoTitle}
                category={category}
                setCategory={setCategory}
                videoDifficulty={videoDifficulty}
                setVideoDifficulty={setVideoDifficulty}
                videoDescription={videoDescription}
                setVideoDescription={setVideoDescription}
                videoTranscript={videoTranscript}
                setVideoTranscript={setVideoTranscript}
                searchQuery={searchQuery}
                videoId={videoId}
                thumbnail={thumbnail}
                publishTime={publishTime}
                channelId={channelId}
                channelTitle={channelTitle}
                categories={categories}
                videoKeywords={videoKeywords} // Pass videoKeywords to the dialog
                setVideoKeywords={setVideoKeywords} // Pass setVideoKeywords to DialogComponent
            />
            <TableComponent
                videos={videos}
                handleDeleteVideo={handleDeleteVideo}
                handleEditVideo={handleEditVideo}
            />

            <Typography variant="body2" style={{ marginTop: '1rem' }}>
                Number of video(s) added: {videos.length}
            </Typography>
            <br></br>
            <Box sx={{ display: 'flex', justifyContent: 'left', margin: '1rem' }}>
                <Button variant="contained" color="primary" onClick={generateNewKeywordsForAllVideos}>
                    Generate Keywords for all videos
                </Button>
                <ProgessBarComponent value={progress} />
            </Box>


            <div>
                {/* Existing Buttons */}
                <Box sx={{ display: 'flex', justifyContent: 'left', margin: '1rem' }}>
                    <Button variant="contained" color="primary" onClick={generateNewKeywordsForAllVideos}>
                        Generate Keywords for all videos
                    </Button>
                    <Button variant="contained" color="secondary" onClick={openUpdate} style={{ marginLeft: '1rem' }}>
                        Update Transcripts
                    </Button>
                    <ProgessBarComponent value={progress} />
                </Box>

                {/* Update Transcripts Dialog */}
                {isUpdateOpen && <UpdateComponent onClose={closeUpdate} />}
            </div>

        </div>
    );
};

export default CrudTable;
