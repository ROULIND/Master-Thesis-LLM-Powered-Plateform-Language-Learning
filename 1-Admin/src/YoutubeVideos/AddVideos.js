import React, { useState, } from 'react';
import axios from 'axios';
import { Grid, Button, Typography } from '@mui/material';
import './GetVideos.css'; // Import the CSS file
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import SearchIcon from '@mui/icons-material/Search';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import LinearProgress from '@mui/material/LinearProgress';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import VideoCard from '../components/VideoCardAddVideos';
const apiUrl = process.env.REACT_APP_API_URL;

const GetVideos = () => {

    const [videos, setVideos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('channelId'); // Default search type
    const [loading, setLoading] = useState(false); // Add loading state
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [loadingSearchVideo, setLoadingSearchVideo] = useState(false); // Add loading state


    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleOpenDialog = (title, message, messageServer, isError) => {
        setDialogMessage(
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', borderRadius: '50%', background: 'white', padding: '5px' }}>
                    {title === 'Oops' ? (
                        <ErrorOutlineIcon sx={{ fontSize: 60, color: '#f44336' }} />
                    ) : (
                        <CheckCircleOutlineIcon sx={{ fontSize: 60, color: '#4caf50' }} />
                    )}
                </div>
                <div style={{ width: 370, padding: 10, textAlign: 'left', paddingTop: '70px' }}>
                    <div style={{ fontSize: '20px', textAlign: 'center', fontWeight: 'bold' }}>{title}</div>
                    <div style={{ height: '10px' }}></div>
                    <div style={{ fontSize: '17px' }}>{message}</div>
                    <div style={{ fontSize: '17px' }}>{messageServer}</div>
                </div>

            </div>
        );
        setOpenDialog(true);
    };

    const handleSearch = () => {
        setLoading(true);
        if (searchType === 'channelId') {
            axios.get(`${apiUrl}/admin/searchchannel/${searchTerm}`)
                .then(response => {
                    setVideos(response.data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching channel videos:', error);
                });
        } else if (searchType === 'videoId') {
            axios.get(`${apiUrl}/admin/simple-search`, {
                params: {
                    q: searchTerm // Add the search term to the request
                }
            })
                .then(response => {
                    setVideos(response.data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching videos:', error);
                });
        }
    };
    const navigate = useNavigate(); // Get the navigate function
    const handleHelpClick = () => {
        alert("To find the channel ID, navigate to a YouTube channel, click on the arrow > next to 'learn more about this channel', and then click on 'Share this channel'. You will have the option to select the Channel ID.");
    };

    const handleGoBack = () => {
        navigate(-1); // Use navigate to go back
    };
    const addVideo = (videoId) => {
        setLoadingSearchVideo(true);
        axios.get(`${apiUrl}/video/add/${videoId}`)
            .then(response => {
                const title = 'Congratulations';
                const message = `The video ${videoId} has been added successfully`;
                const messageServer = `Server message: ${response.data.message}`;
                setLoadingSearchVideo(false);
                handleOpenDialog(title, message, messageServer, true);
            })
            .catch(error => {
                console.error('Error adding video:', error);
                if (error.response && error.response.status === 400) {
                    // It's a 400 error, extract the error message
                    const title = 'Oops';
                    const message = `There was an error adding ${videoId}`;
                    const messageServer = `Server message: ${error.response.data.error}`;
                    setLoadingSearchVideo(false);
                    handleOpenDialog(title, message, messageServer, true);
                } else {
                    // Handle other errors
                    const title = 'Oops';
                    const message = `There was an error adding ${videoId}`;
                    const messageServer = `Server message: ${error}`;
                    setLoadingSearchVideo(false);
                    handleOpenDialog(title, message, messageServer, true);
                }
            });
    };

    const SkeletonCard = () => {
        return (
            <div style={{ padding: '10px', marginBottom: '20px', borderRadius: '10px', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}>
                <Skeleton className="custom-card" variant="rect" width={400} height={150} style={{ borderRadius: '10px' }} />
                <Skeleton variant="text" width="70%" style={{ marginTop: '10px', background: '#D2DBE2', borderRadius: '7px', minHeight: '10px' }} />
                <Skeleton variant="text" width="40%" style={{ marginTop: '10px', background: '#D2DBE2', borderRadius: '7px', minHeight: '10px' }} />
            </div>
        );
    };

    return (
        <div>
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogContent>
                    {dialogMessage}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Close</Button>
                </DialogActions>
            </Dialog>
    
            <div style={{ background: '#DD8B18', padding: '10px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Button color="primary" startIcon={<ArrowBackIcon style={{ color: 'white' }} />} onClick={handleGoBack}>
                    <span style={{ color: 'white' }}>Back</span>
                </Button>
                <Typography variant="h5" style={{ color: 'white' }}>
                    <span style={{ color: 'white' }}>Add videos through Search and Channel ID</span>
                    <div style={{ width: '10px', height: '10px' }}></div>
                    <div style={{ color: 'white', fontSize: '12px', cursor: 'pointer' }} onClick={handleHelpClick}>How to find channelID ?</div>
                </Typography>
                <div></div>
            </div>
            {loadingSearchVideo ?
                <LinearProgress style={{ backgroundColor: '#f44336' }} /> : null}
            <div style={{ height: '30px' }}></div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <FormControl required style={{ marginRight: '10px' }}>
                        <InputLabel htmlFor="search-type">Search Type</InputLabel>
                        <Select
                            value={searchType}
                            onChange={(e) => setSearchType(e.target.value)}
                            label="Search Type"
                            inputProps={{
                                name: 'searchType',
                                id: 'search-type',
                            }}
                        >
                            <MenuItem value="channelId">Channel ID</MenuItem>
                            <MenuItem value="videoId">Basic Search</MenuItem>
                        </Select>
                    </FormControl>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search"
                        style={{
                            padding: '10px',
                            borderTopLeftRadius: '80px 80px',
                            borderBottomLeftRadius: '80px 80px',
                            border: '1px solid #ccc',
                            width: '300px',
                            height: '20px',
                            fontSize: '16px',
                            outline: 'none', // Remove the default focus outline
                        }}
                        // CSS for when input is focused
                        onFocus={(e) => {
                            e.target.style.border = '1px solid #007bff';
                            e.target.style.color = '#000000';
                            e.target.style.backgroundColor = '#fafafa';
                        }}
                        // Reset styles on blur
                        onBlur={(e) => {
                            e.target.style.border = '1px solid #ccc';
                            e.target.style.color = '#000000';
                            e.target.style.backgroundColor = '#fafafa';
                        }}
                    />
                    <div onClick={handleSearch} style={{
                        width: '35px',
                        textAlign: 'center',
                        backgroundColor: '#FaFaFa',
                        padding: '10px',
                        border: '1px solid #ccc',
                        borderTopRightRadius: '80px 80px',
                        borderBottomRightRadius: '80px 80px',
                        marginRight: '0',
                        height: '20px',
                        cursor: 'pointer' // Add this line
                    }} >
                        <SearchIcon style={{ fontSize: '20px' }} />
                    </div>
                </div>
            </div>
    
            <div style={{ paddingTop: '50px' }}></div>
            <Grid container spacing={2}>
                {loading && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                        {[...Array(10)].map((_, index) => (
                            <div key={index} style={{
                                flex: '1 0 20%', width: '100%',
                                padding: 0
                            }}>
                                <SkeletonCard />
                            </div>
                        ))}
                    </div>
                )}
                {!loading && videos.length > 0 && (
                    videos.map((video, index) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={index} className="main-divs" >
                            <VideoCard video={video} />
                            <div
                                onClick={() => addVideo(video.videoId)}
                                style={{ cursor: 'pointer', width: '100%', background: '#DF7045', color: 'white', fontWeight: 'bold', fontSize: '15px', textAlign: 'center', borderRadius: '5px', padding: '5px' }}
                            >
                                Add this video
                            </div>
                        </Grid>
                    ))
                )}
            </Grid >
        </div >
    );
}
export default GetVideos;
