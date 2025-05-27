// Checked
import React, { useState } from 'react';
import axios from 'axios';
import { CircularProgress } from '@mui/material';
import {CheckCircleOutline, DoNotDisturb } from '@mui/icons-material';

const apiUrl = process.env.REACT_APP_API_URL; // URL API

const TestingCloudStorage = () => {
    const [statusMessages, setStatusMessages] = useState([]);
    const [isTesting, setIsTesting] = useState(false);

    const testGetVideos = async () => {
        try {
            const start = performance.now();
            const response = await axios.get(`${apiUrl}/storage/videos/`);
            const end = performance.now();
            const timeTaken = ((end - start) / 1000).toFixed(2);
            const message = {
                query: 'GET /storage/videos/',
                result: 'Request Successful',
                timeTaken: `${timeTaken} seconds`
            };
            setStatusMessages(prev => [...prev, message]);
        } catch (error) {
            const message = {
                query: 'GET /storage/videos/',
                result: `Error: ${error.message}`,
                timeTaken: ''
            };
            setStatusMessages(prev => [...prev, message]);
        }
    };

    const testAddVideo = async (videoId) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds
            const start = performance.now();
            const response = await axios.get(`${apiUrl}/video/add/${videoId}`);
            const end = performance.now();
            const timeTaken = ((end - start) / 1000).toFixed(2);
            const message = {
                query: `GET /video/add/`,
                result: 'Request Successful',
                timeTaken: `${timeTaken} seconds`
            };
            setStatusMessages(prev => [...prev, message]);
        } catch (error) {
            const message = {
                query: `GET /video/add/`,
                result: `Error - ${error.message}`,
                timeTaken: ''
            };
            setStatusMessages(prev => [...prev, message]);
        }
    };

    const testDeleteVideo = async (videoId) => {

        try {
            await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds
            
            const start = performance.now();
            await axios.delete(`${apiUrl}/video/delete/${videoId}`);
            const end = performance.now();
            const timeTaken = ((end - start) / 1000).toFixed(2);
            const message = {
                query: `DELETE /video/delete/`,
                result: 'Request Successful',
                timeTaken: `${timeTaken} seconds`
            };
            setStatusMessages(prev => [...prev, message]);
        } catch (error) {
            const message = {
                query: `DELETE /video/delete/`,
                result: `Error - ${error.message}`,
                timeTaken: ''
            };
            setStatusMessages(prev => [...prev, message]);
        }
    };

    const startTests = async () => {
        if (!isTesting) {
            setIsTesting(true);
            setStatusMessages([]);
            try {
                await testGetVideos();
                const videoId = 'l25LfXEk8i4'; // Replace with actual video ID
                await testAddVideo(videoId);
                await testDeleteVideo(videoId);
            } finally {
                setIsTesting(false);
            }
        }
    };

    return (
        <div>
            <div className="dashboard-box">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div onClick={startTests} className="typo-box" disabled={isTesting}>
                        Google Storage - Unit Test
                    </div>
                    <div></div>
                </div>
                <div style={{ height: '20px' }}></div>
                <div onClick={startTests} style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ textDecoration: 'underline', cursor: 'pointer', fontWeight: '600', fontSize: '17px', color: 'black' }} disabled={isTesting}>
                        Start Unit Tests
                    </div>
                    {isTesting && <div className="loading-icon"><CircularProgress style={{ marginLeft: '10px', fontSize: '15px' }} /></div>}
                </div>

                <div style={{ height: '20px' }}></div>

                <div className="box-content">
                    {statusMessages.map((message, index) => (
                        <div key={index} className="query-result">
                            <div className="status" style={{ display: 'flex' }}>
                                <div className="status-text" style={{ marginRight: '20px' }}>{message.result}</div>
                                {message.result === 'Request Successful' ? (
                                    <CheckCircleOutline style={{ color: 'green' }} className="status-icon" />
                                ) : (
                                    <DoNotDisturb style={{ color: 'red' }} />
                                )}
                            </div>

                            <div className="query-details">
                                <div className="query-text" style={{ fontStyle: 'italic', fontWeight: '450' }}>{message.query}</div>
                                <div className="time-taken">
                                    <span style={{ fontWeight: 'bold' }}>Time Taken:</span> {message.timeTaken}
                                </div>
                            </div>
                            <div style={{ height: '10px', width: '180px', borderBottom: '1px solid grey' }}></div>
                            <div style={{ height: '10px' }}></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TestingCloudStorage;
