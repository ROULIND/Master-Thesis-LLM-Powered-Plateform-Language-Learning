import React, { useState, useEffect } from 'react';
import { auth } from '../../firebase';
import { updateVisitedVideos, getVisitedVideos } from '../../firebaseFunction';

const YourComponent = () => {
  const [user, setUser] = useState(null);
  const [videoId, setVideoId] = useState('');
  const [visitedVideos, setVisitedVideos] = useState([]);

  // Get user id here
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchVisitedVideos = async () => {
    if (userId) {
      const videos = await getVisitedVideos(userId);
      setVisitedVideos(videos);
    }
  };

  useEffect(() => {
    fetchVisitedVideos();
  }, [userId]);

  const handleAddVideo = () => {
    if (userId && videoId) {
      updateVisitedVideos(userId, videoId);
      console.log(`Video ${videoId} added for user ${userId}`);
    } else {
      console.error('Invalid user ID or video ID');
    }
  };

  console.log(visitedVideos)

  return (
    <div>
      {user ? <p>Welcome, {user.email}!</p> : <p>Please log in.</p>}
      <input
        type="text"
        placeholder="Enter Video ID"
        value={videoId}
        onChange={(e) => setVideoId(e.target.value)}
      />
      <button onClick={handleAddVideo}>Add Video</button>

      <h2>Visited Videos</h2>
      <ul>
        {visitedVideos.map((video) => (
          <li key={video}>{video}</li>
        ))}
      </ul>
    </div>
  );
};

export default YourComponent;
