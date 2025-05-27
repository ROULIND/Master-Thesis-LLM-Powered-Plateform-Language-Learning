import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Grid, Card, MenuItem, Select } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import axios from 'axios'; // Import the axios library
import VideoCard from '../components/Cards/VideoCard';
import SkeletonCard from '../components/UniqueVideo/SkeletonVideos'
import SkeletonComplete from '../components/UniqueVideo/Skeletoncomplete'
import DragList from '../components/UniqueVideo/DragList';
import UserMenu from '../components/UserMenu';

import 'react-loading-skeleton/dist/skeleton.css'
import './UniqueVideo.css';
import { auth } from '../firebase';
import { updateVisitedVideos, getVisitedVideos, getUserLearningLanguage } from '../firebaseFunction';
import LinearProgress from '@mui/material/LinearProgress';
import SearchBar from '../components/searchBar';
import { handleSearch, handleInputChange } from './searchFunctions';
import VideoTranscript from '../components/videoTranscript/videoTranscript';
import { formatDistanceToNow } from 'date-fns';
import { fr, enUS } from '../../node_modules/date-fns/locale';

const apiUrl = process.env.REACT_APP_API_URL;

const MY_UID = 'N0GWo07DFDbe5oiUXU1S5ekSw9s1'; // Replace with your Firebase UID



const VideoDetails = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [isEditingTranscript, setIsEditingTranscript] = useState(false);
  const [editedTranscript, setEditedTranscript] = useState('');
  const [videos, setVideos] = useState([]);
  const isScreenSmall = useMediaQuery('(max-width:900px)');
  const [showFullTranscript, setShowFullTranscript] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [allDifficulties, setAllDifficulties] = useState(new Set());
  const [user, setUser] = useState(null); // Initialize user state
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState(null);
  const [searchResultss, setSearchResults] = useState([]);
  const videoDifficulties = allDifficulties
  const [selectedLanguage, setSelectedLanguage] = useState("fr");
  const [recommendedVideos, setRecommendedVideos] = useState([]);
  const [visitedVideos, setVisitedVideos] = useState([]);

  // Constants for the translation dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedWord, setSelectedWord] = useState('');
  const [wordPosition, setWordPosition] = useState(null);
  const [translation, setTranslation] = useState('');

  

  const navigate = useNavigate();

  // Get user id here
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    // Subscribe to changes in the authentication state
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user); // Set the user state if user is authenticated
      } else {
        setUser(null); // Set user state to null if user is not authenticated
      }
    });

    // Clean up subscription on component unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (userId) {
      // Assuming updateVisitedVideos and getVisitedVideos are available in the current scope
      updateVisitedVideos(userId, videoId); // Call the function to update visited videos
      setVisitedVideos(getVisitedVideos(userId)); // Call the function to get visited videos
      // Fetch user learning language when user is authenticated
      const fetchUserLearningLanguage = async () => {
        const learningLanguage = await getUserLearningLanguage(userId);
        setSelectedLanguage(learningLanguage);
        console.log('Learning language:', learningLanguage);
      };
      fetchUserLearningLanguage();
    }
  }, [userId, videoId]);

  useEffect(() => {
    setLoading(true);

    axios.get(`${apiUrl}/storage/videos`)
      .then(response => {
        setVideos(response.data);
        setLoading(false);
        const difficultySet = new Set(response.data.map(video => video.videoDifficulty));
        setAllDifficulties(difficultySet);
      })
      .catch(error => {
        console.error('Error fetching videos:', error);
      });
  }, []);



  useEffect(() => {
    fetch(`${apiUrl}/storage/videos/${videoId}`)
      .then((response) => response.json())
      .then((data) => setVideo(data))
      .catch((error) => console.error('Error fetching video:', error));
  }, [videoId]);


  useEffect(() => {
    // Only run if all necessary data is available and videos has been populated
    if (videoId && video && selectedLanguage && videos.length > 0) {
      // Debug logs to check values
      console.log("Fetching recommendations for videoId:", videoId);
      console.log("Video transcript:", video.videoTranscript);
      console.log("Selected language:", selectedLanguage);
  
      fetch(`${apiUrl}/video/recommendation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoId: videoId,
          transcript: video.videoTranscript,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          console.log("Recommended videos from API:", data);
          // Extract video IDs from API response
          const recommendedVideoIds = data.map((item) => item.video_id);
          console.log("Recommended video IDs from API:", recommendedVideoIds);
  
          // Find matching videos from the local `videos` state
          let filteredRecommendedVideos = recommendedVideoIds
            .map((id) => {
              // Ensure that the ID comparison is between like types (e.g., both strings)
              return videos.find((videoItem) => String(videoItem.videoId) === String(id));
            })
            .filter((videoItem) => videoItem && videoItem.videoLanguage === selectedLanguage);
  
          // Check if there are any valid videos
          if (!filteredRecommendedVideos.length) {
            setRecommendedVideos([]);
            return;
          }
  
          // Ensure visitedVideos is an array and that IDs are compared as strings
          const visitedVideosArray = Array.isArray(visitedVideos) ? visitedVideos.map(String) : [];
  
          console.log("Visited videos:", visitedVideosArray);
          
          // Reorder: Non-visited videos first, visited videos at the end
          filteredRecommendedVideos = filteredRecommendedVideos.sort((a, b) => {
            const aVisited = visitedVideosArray.includes(String(a.videoId));
            const bVisited = visitedVideosArray.includes(String(b.videoId));
            // false (0) - true (1) = negative → a comes first if not visited
            return aVisited - bVisited;
          });
  
          // Update state with the reordered recommended videos
          setRecommendedVideos(filteredRecommendedVideos);
          console.log("Reordered Recommended Videos:", filteredRecommendedVideos);
        })
        .catch((error) => {
          console.error('Error fetching recommended videos:', error);
        });
    }
  }, [videoId, video, videos, selectedLanguage, visitedVideos]); // Added `video` and a check for videos.length > 0
  



// Function to calculate relative date
function calculateRelativeDate(publishTime) {
  console.log(publishTime);
  const publishDate = new Date(publishTime);
  const currentDate = new Date();

  // Calculate the difference in months
  const totalMonthsDiff = (currentDate.getFullYear() - publishDate.getFullYear()) * 12 
                        + (currentDate.getMonth() - publishDate.getMonth());

  if (totalMonthsDiff >= 12) {
      const years = Math.floor(totalMonthsDiff / 12);
      return `${years} year${years > 1 ? 's' : ''} ago`;
  } else {
      return formatDistanceToNow(publishDate, { locale: enUS }) + " ago";
  }
}

  
  



  if (!video) {
    return <SkeletonComplete />;
  }

  const toggleTranscript = () => {
    setShowFullTranscript(!showFullTranscript);
  };

  const handleWordClick = async (word) => {
      console.log('Word clicked:', word);
      try {
          const response = await axios.get(`${apiUrl}/translation/translate`, {
              params: { word }
          });

          // Axios automatically parses JSON responses, no need for .json()
          return response.data.translation || "No translation available"; 
      } catch (error) {
          console.error("Error fetching translation:", error.message);
          return "Translation error";
      }
  };

  // New: Handler for language change
  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
    console.log('Selected language:', event.target.value);
  };
  
  
  


  // URL to get recommended videos ids : ${autcompleteURL}/vector-search`
  // take parameter videoId : videoId
  // Typicall output : [{videoId: 'videoId1'}, {videoId: 'videoId2'}, ...]
  // [{"original_video_id": "DazUaVu5MO0","similarity_score": 0.7899034,"title": "Qu’est-ce que l’intelligence artificielle ?","video_id": "cX9V3iNBUoo"}, {...}]

  const filteredVideos = [] // This if for the demo, you can remove this line after




  //videos.filter(videos => videos.videoDifficulty === video.videoDifficulty);

  const filteredVideosVideo = selectedDifficulty
    ? videos.filter(video => video.videoDifficulty === selectedDifficulty)
    : filteredVideos;


  

  const backToHome = () => {
    let path = `/`;
    navigate(path);
  }


   const handleQueryChange = (event) => {
      console.log('Selected language:', selectedLanguage);
      handleInputChange(event, setQuery, setSuggestions, selectedLanguage);
    };

  const handleSearchSubmit = () => {
    handleSearch(query, setSearchResults, navigate, setIsLoading, setError);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setQuery(suggestion);
    setSuggestions([]);
  };

  return (
    <div >
      <div className='responsiveHeader2' style={{ width: '100%', justifyContent: 'space-between', padding: '5px' }}>
        <div className='responsiveHeader' >
          <div style={{ paddingLeft: '15px' }}>
            <img src={process.env.PUBLIC_URL + '/Lingorank.png'} alt="description" style={{ height: '75px', width: '180px', borderRadius: '15px', cursor: 'pointer' }}
              onClick={backToHome} />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>

              <div style={{ display: 'flex', alignItems: 'center' }}>
                <SearchBar
                  query={query}
                  handleInputChange={handleQueryChange}
                  handleSearch={handleSearchSubmit}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="responsiveHeader">
              {/* User Menu Dropdown */}
              <UserMenu user={user} />

              {/* Language Selector */}
              {user?.uid === MY_UID ? (
                  // If the special user is logged in, show full language selection
                  <Select
                      labelId="language-selector-label"
                      id="language-selector"
                      value={selectedLanguage}
                      onChange={handleLanguageChange}
                      sx={{
                          height: '30px',
                          fontSize: '18px',
                          color: '#555',
                          marginRight: '10px',
                      }}
                  >
                      {/*<MenuItem value={"fr"}>🌍 All Languages</MenuItem>*/}
                      <MenuItem value={"fr"}>🇫🇷 French</MenuItem>
                      <MenuItem value={"de"}>🇩🇪 German</MenuItem>
                      <MenuItem value={"en"}>🇬🇧 English</MenuItem> {/* Example: More options */}
                  </Select>
              ) : (
                  // Otherwise, only display the selected language flag
                  <div style={{ fontSize: '24px', paddingLeft: '10px' }}>
                      {selectedLanguage === "fr" ? "🇫🇷" : selectedLanguage === "de" ? "🇩🇪" : "🌍"}
                  </div>
              )}
          </div>
      </div>
      {suggestions.length > 0 && (
        <div className='suggestion-overlay'>
          <div className='suggestion-box'>
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                style={{
                  cursor: 'pointer',
                  height: '40px',
                  overflowY: 'auto',
                  borderRadius: '4px',
                  fontSize: '15px',
                }}
                onClick={() => handleSuggestionClick(suggestion.title)}
              >
                {suggestion.title}
              </div>
            ))}
          </div>
        </div>
      )}
      {isLoading ? <LinearProgress></LinearProgress> : <div></div>}

      <div className="video-details" style={{ paddingTop: '50px' }}>

        <div className="video-container">
          <div className="iframe-wrapper">
            <iframe
              src={`https://www.youtube.com/embed/${video.videoId}`}
              allowFullScreen
            ></iframe>
          </div>
          <div className="video-content">{isEditingTranscript ? (
            <div>
              <textarea
                value={editedTranscript}
                onChange={(e) => setEditedTranscript(e.target.value)}
                rows={8}
                cols={50}
              />
            </div>
          ) : (
            <div>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Card
                  className="custom-card"
                  style={{
                    width: "100%",
                    height: '90px',
                    padding: "0",
                    boxShadow: "none",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      padding: "5px",
                      paddingTop: "15px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        position: "relative",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src={video.channelImage}
                        alt={video.videoTitle}
                        style={{
                          width: "40px",
                          height: "40px",
                          objectFit: "cover",
                          borderRadius: "50%",
                        }}
                      />
                    </div>

                    <div style={{ height: "20px", marginLeft: "15px", textAlign: 'left' }}>
                      <div style={{ fontSize: "14px", fontWeight: "600", textAlign: 'left' }}>
                        {video.videoTitle}
                      </div>

                      <div
                        style={{
                          height: "2px",
                          display: "flex",
                          fontWeight: "600",
                          color: "#555",
                          fontSize: "14px",
                          marginTop: "10px",
                          alignItems: "center",
                        }}
                      >
                        {calculateRelativeDate(video.publishTime)} ago
                        <div style={{ marginLeft: "4px" }}>•</div>
                        <div style={{ marginLeft: "5px" }}>
                          {(video.videoStatistics.viewCount)}{" "}
                          views
                        </div>
                      </div>
                    </div>

                    <div style={{ paddingLeft: "50px" }}>
                      <div
                        style={{
                          color: "white",
                          background: video.videoDifficultyColor,
                          borderRadius: "10px",
                          textAlign: "center",
                          padding: "5px",
                          paddingBottom: "12px",
                          height: "15px",
                          fontWeight: "600",
                          width: "40px",
                        }}
                      >
                        {video.videoDifficulty}
                      </div>
                    </div>
                  </div>
                </Card>
              </Grid>
              <p style={{ fontSize: '16px', padding: '10px', textAlign: 'justify', fontWeight: '400' }}>
              {showFullTranscript ? (
                <VideoTranscript
                  videoTranscript={video.videoTranscript}
                  handleWordClick={handleWordClick}
                />
              ) : (
                <p style={{ textAlign: 'justify', fontFamily: 'Arial', fontSize: '17px' }}>
                  {video.videoTranscript
                    .split(' ')
                    .map((word, index) => {
                      if (index === 0) {
                        return word.charAt(0).toUpperCase() + word.slice(1);
                      } else {
                        return word;
                      }
                    })
                    .slice(0, 50)
                    .join(' ')}...
                </p>
              )}
              {!showFullTranscript && (
                <span onClick={toggleTranscript} style={{ color: 'grey', cursor: 'pointer' }}>
                  Read More
                </span>
              )}
              {showFullTranscript && (
                <span onClick={toggleTranscript} style={{ color: 'grey', cursor: 'pointer' }}>
                  Read Less
                </span>
              )}
            </p>



            </div>
          )} </div>
        </div>



        
        <div className="additional-div">
          {isScreenSmall ? (
            <Grid container spacing={2}>
              {loading ? (
                <div style={{ width: '100%', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {[...Array(50)].map((_, index) => (
                    <div key={index} style={{ flex: '5 100 1%', width: '100%', padding: 0 }}>
                      <SkeletonCard />
                    </div>
                  ))}
                </div>
              ) : (
                recommendedVideos.slice(0, 4).map((videoId, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                    <VideoCard video={videoId}></VideoCard>
                  </Grid>
                ))
              )}
            </Grid>
          ) : (
            <Grid item xs={12} sm={6} md={4} lg={3}>
              {/* <DragList videoDifficulties={videoDifficulties} setSelectedDifficulty={setSelectedDifficulty} /> */}
              <div style={{ fontSize: '20px', fontWeight: '500', textAlign: 'left', paddingLeft: '20px' }}>
                Recommended videos:
              </div>
              {loading ? (
                <div style={{ width: '100%', padding: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {[...Array(50)].map((_, index) => (
                    <div key={index} style={{ flex: '5 100 1%', width: '100%', padding: 0 }}>
                      <SkeletonCard />
                    </div>
                  ))}
                </div>
              ) : (
                recommendedVideos.slice(0, 5).map((videoId, index) => (
                  <Grid item key={index} style={{ padding: '20px' }}>
                    <VideoCard video={videoId}></VideoCard>
                  </Grid>
                ))
              )}
            </Grid>
          )}
        </div>

      </div>
    </div>
  );
};

export default VideoDetails;
