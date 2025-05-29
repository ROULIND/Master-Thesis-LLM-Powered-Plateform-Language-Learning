import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'react-loading-skeleton/dist/skeleton.css';
import { Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

// Icons
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';

// CSS
import './Chatbot.css';

// User Login
import { auth } from '../firebase';
import { getVisitedVideos, addCategoryOfInterest, getUserCategoriesOfInterest } from '../firebaseFunction';

const apiUrl = process.env.REACT_APP_API_URL;

// Chatbot Page
const Chatbot = () => {
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [selectedTab, setSelectedTab] = useState('Side Bar');

    const handleTabClick = (tab) => {
        setSelectedTab(tab);
    };

    useEffect(() => {
        // Check if a user is already authenticated
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });
        return () => unsubscribe(); // Clean up the subscription on component unmount
    }, []);

    const navigate = useNavigate();
    const backToHome = () => {
        let path = `/`;
        navigate(path);
    };

    useEffect(() => {
        const container = document.getElementById('list-container');
        if (container) {
            // You may want to add logic here
        }
    }, []);

    return (
        <div className="app-overlay">
            <div>
                <div
                    className="responsiveHeader2"
                    style={{
                        width: '100%',
                        justifyContent: 'space-between',
                        padding: '5px',
                    }}
                >
                    <div className="responsiveHeader">
                        <img
                            src={process.env.PUBLIC_URL + '/Lingorank.png'}
                            alt="description"
                            style={{
                                height: '45px',
                                width: '120px',
                                borderRadius: '15px',
                                cursor: 'pointer',
                            }}
                            onClick={backToHome}
                        />
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    />

                    <div className="responsiveHeader">
                        {user ? (
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    paddingTop: '10px',
                                }}
                            >
                                <div style={{ paddingRight: '20px', cursor: 'pointer' }}>
                                    <div
                                        style={{
                                            textAlign: 'center',
                                            height: '22px',
                                            borderRadius: '10px',
                                            padding: '5px',
                                            fontSize: '15px',
                                            background: '#e38940',
                                            color: 'white',
                                        }}
                                        onClick={() => auth.signOut()}
                                    >
                                        <LogoutIcon />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    paddingTop: '10px',
                                }}
                            >
                                <Link to={`/users/login`} style={{ textDecoration: 'none' }}>
                                    <div style={{ paddingRight: '20px', cursor: 'pointer' }}>
                                        <div
                                            style={{
                                                textAlign: 'center',
                                                height: '22px',
                                                borderRadius: '10px',
                                                padding: '5px',
                                                fontSize: '15px',
                                                background: '#e38940',
                                                color: 'white',
                                            }}
                                        >
                                            <LoginIcon />
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content with Left Sidebar */}
            <div style={{ display: 'flex' }}>
                {/* Left Sidebar */}
                <div style={{ width: '180px', padding: '10px' }}>
                    <div
                        onClick={() => handleTabClick('Accueil')}
                        style={{
                            cursor: 'pointer',
                            fontWeight: selectedTab === 'Accueil' ? 'bold' : 'normal',
                            marginBottom: '10px',
                        }}
                    >
                        <p style={{ margin: '20px' }}>Side Bar</p>
                    </div>
                    {user && (
                        <div>
                            <p style={{ margin: '20px' }}>Side Bar</p>
                        </div>
                    )}
                </div>

                {/* Main Video Content */}
                <div style={{ flex: 1 }}>
                    <Grid container spacing={2} className="special-div">
                        <p style={{ fontSize: '20px', fontWeight: 'bold', margin: '20px' }}>
                            Implement chatbot here
                        </p>
                    </Grid>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
