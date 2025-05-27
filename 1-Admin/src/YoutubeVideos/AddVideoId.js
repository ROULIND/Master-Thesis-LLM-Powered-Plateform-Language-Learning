import React, { useState } from 'react';
import axios from 'axios';
import { Button, Typography, LinearProgress, Dialog, DialogContent, DialogActions } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const GetVideos = () => {
    const apiUrl = process.env.REACT_APP_API_URL;

    const [searchTerm, setSearchTerm] = useState('');
    const [loadingSearchVideo, setLoadingSearchVideo] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleOpenDialog = (title, message, messageServer, isError) => {
        const iconColor = isError ? '#f44336' : '#4caf50';
        const Icon = isError ? <ErrorOutlineIcon sx={{ fontSize: 60, color: iconColor }} /> : <CheckCircleOutlineIcon sx={{ fontSize: 60, color: iconColor }} />;

        setDialogMessage(
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', borderRadius: '50%', background: 'white', padding: '5px' }}>
                    {Icon}
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

    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    // Function to update Elasticsearch index
    const updateElasticsearchIndex = async () => {
        try {
        const response = await axios.post(`http://127.0.0.1:5003/update-elasticsearch-index`);
        console.log('Elasticsearch index updated:', response.data);
        } catch (error) {
        console.error('Error updating Elasticsearch index:', error);
        }
    };

    // Function to generate keywords for the added video
    const generateKeywords = async (videoId) => {
        try {
            const response = await axios.get(`http://127.0.0.1:5003/get-video-keywords?videoId=${videoId}`);
            console.log('Keywords generated:', response.data);
        } catch (error) {
            console.error('Error generating keywords:', error);
        }
    };

    // Function to handle searching and adding a video
    const handleSearch = () => {
        setLoadingSearchVideo(true);
        axios.post(`${apiUrl}/video/add/${searchTerm}`)
            .then(async (response) => {
                const videoId = searchTerm; // Assuming the videoId is the searchTerm here
                const title = 'Congratulations';
                const message = `The video has been added successfully`;
                const messageServer = `Server message: ${response.data.message}`;

                // Generate keywords for the added video
                //await generateKeywords(videoId);

                // Update the Elasticsearch index after generating keywords
                //await updateElasticsearchIndex();

                setLoadingSearchVideo(false);
                handleOpenDialog(title, message, messageServer, false);
            })
            .catch(error => {
                console.error('Error adding video:', error);
                if (error.response && error.response.status === 400) {
                    const title = 'Oops';
                    const message = `There was an error adding the video`;
                    const messageServer = `Server message: ${error.response.data.error}`;
                    setLoadingSearchVideo(false);
                    handleOpenDialog(title, message, messageServer, true);
                } else {
                    const title = 'Oops';
                    const message = `There was an error adding the video`;
                    const messageServer = `Server message: ${error}`;
                    setLoadingSearchVideo(false);
                    handleOpenDialog(title, message, messageServer, true);
                }
            });
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
                    <span style={{ color: 'white' }}>Add videos through specific videoId</span>
                </Typography>
            </div>

            {loadingSearchVideo &&
                <LinearProgress style={{ backgroundColor: '#f44336' }} />
            }

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
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
                            outline: 'none',
                        }}
                        onFocus={(e) => {
                            e.target.style.border = '1px solid #007bff';
                            e.target.style.color = '#000000';
                            e.target.style.backgroundColor = '#fafafa';
                        }}
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
                        cursor: 'pointer'
                    }}>
                        <SearchIcon style={{ fontSize: '20px' }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GetVideos;
