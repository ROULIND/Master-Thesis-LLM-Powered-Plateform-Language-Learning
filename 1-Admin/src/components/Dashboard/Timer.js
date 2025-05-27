import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BackupTimer = () => {
  const apiURL = process.env.REACT_APP_API_URL;
  const [nextBackup, setNextBackup] = useState(null);
  const [numVideos, setNumVideos] = useState(0);

  useEffect(() => {
    axios.get(`${apiURL}/get-storage-content`)
      .then(response => {
        const allVideos = response.data;
        setNumVideos(allVideos.length);
      })
      .catch(error => {
        console.log('Error fetching videos', error);
      });
  }, []);

  useEffect(() => {
    const now = new Date();
    let nextFirstOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    // If today is the first day of the month, set nextFirstOfMonth to the following month's first day
    if (now.getDate() === 1) {
      nextFirstOfMonth = new Date(now.getFullYear(), now.getMonth() + 2, 1);
    }

    // Calculate the number of milliseconds until the next first day of the month
    const timeUntilNextFirstOfMonth = nextFirstOfMonth - now;
    // Convert milliseconds to days
    const days = Math.floor(timeUntilNextFirstOfMonth / (1000 * 60 * 60 * 24));

    setNextBackup(days);
  }, []);

  return (
    <div>
      <div className='typo-box'>Next Backup:</div>
      <div style={{ height: '20px' }}></div>
      {nextBackup !== null && (
        <div style={{ fontSize: '18px' }}>
          <span style={{ fontWeight: 'bold' }}>{nextBackup} {nextBackup === 1 ? 'day' : 'days'}</span> remaining until Backup
        </div>
      )}
      <div style={{ height: '20px' }}></div>
      <span style={{ fontWeight: 'bold' }}>Please just download the JSON file in Google Cloud Storage and add it in the Github Repository (replace the one before)</span>
      <div style={{ height: '20px' }}></div>
      <div style={{ fontSize: '18px' }}>Total Number of Videos in the Database <span style={{ fontSize: '21px', fontWeight: 'bold' }}>{numVideos}</span></div>
    </div>
  );
};

export default BackupTimer;
