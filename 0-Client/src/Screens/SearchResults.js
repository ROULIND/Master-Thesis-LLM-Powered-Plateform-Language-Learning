import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import VideoCard from '../components/Cards/VideoCard';
import { Grid } from '@mui/material';
import axios from 'axios';
import MoodBadIcon from '@mui/icons-material/MoodBad';
import LinearProgress from '@mui/material/LinearProgress';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/searchBar';
import { handleSearch, handleInputChange } from './searchFunctions';
import DragList from '../components/UniqueVideo/DragList';
import excludeVariablesFromRoot from '@mui/material/styles/excludeVariablesFromRoot';
import { auth } from '../firebase';
import { getUserCategoriesOfInterest, getUserLanguageLevel, getUserLearningLanguage } from '../firebaseFunction';
import UserMenu from '../components/UserMenu';
import { MenuItem, Select } from '@mui/material';


const MY_UID = 'N0GWo07DFDbe5oiUXU1S5ekSw9s1'; // Replace with your Firebase UID


const apiUrl = process.env.REACT_APP_API_URL;

const SearchResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [suggestions, setSuggestions] = useState([]);
  const searchResults = location.state?.searchResults || [];
  const [filteredVideos, setFilteredVideos] = useState([]); // Define filteredVideos state
  const [searchResultss, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [error, setError] = useState(null);
  const [videos, setVideos] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("fr");
  const [showMessage, setShowMessage] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);

  const [user, setUser] = useState(null);
  const [userCategories, setUserCategories] = useState([]);
  const [userLanguageLevel, setUserLanguageLevel] = useState(null);

  
  useEffect(() => {
    axios.get(`${apiUrl}/storage/videos`)
      .then(response => {
        setVideos(response.data);
      })
      .catch(error => {
        console.error('Error fetching videos:', error);
      });
  }, []);

  useEffect(() => {
    // Check if a user is already authenticated
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        // Fetch categories of interest when user is authenticated
        const fetchCategoriesOfInterest = async () => {
          const categoriesOfInterest = await getUserCategoriesOfInterest(user.uid);
          setUserCategories(categoriesOfInterest);
        };
        fetchCategoriesOfInterest();

        const fetchUserLanguageLevel = async () => {
          const languageLevel = await getUserLanguageLevel(user.uid);
          setUserLanguageLevel(languageLevel);
        };
        fetchUserLanguageLevel();

        // Fetch user learning language when user is authenticated
        const fetchUserLearningLanguage = async () => {
          const selectedLanguage = await getUserLearningLanguage(user.uid);
          setSelectedLanguage(selectedLanguage);
          console.log('Learning language:', selectedLanguage);
        };
        fetchUserLearningLanguage();

      } else {
        setUser(null);
      }
    });
    return () => unsubscribe(); // Clean up the subscription on component unmount
  }, []);



  useEffect(() => {
    if (searchResults.length > 0) {
        // Map search results to the corresponding videos by videoId
        const orderedVideos = searchResults
            .map((result) => videos.find((video) => video?.videoId === result.videoId))
            .filter((video) => video !== undefined && video.videoLanguage === selectedLanguage); // Filter by selectedLanguage

        // Apply the updated sorting logic
        const sortedVideos = sortVideos(orderedVideos);

        // Update the filtered videos state
        setFilteredVideos(sortedVideos);
        setIsLoading(false);
    } else {
        setFilteredVideos([]);
        setIsLoading(false);
    }
}, [searchResults, videos, selectedDifficulty, userLanguageLevel, selectedLanguage]); // Added selectedLanguage as a dependency

  
  
  // New: Handler for language change
  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
    console.log('Selected language:', event.target.value);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setQuery(suggestion);
    setSuggestions([]);
  };


  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowMessage(true);
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

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

  const sortVideos = (videos) => {
    if (selectedDifficulty) {
      // If a difficulty is selected, filter videos by the selected difficulty
      const matchingSelectedDifficulty = videos.filter(
        (video) => video.videoDifficulty === selectedDifficulty
      );
      const nonMatchingSelectedDifficulty = videos.filter(
        (video) => video.videoDifficulty !== selectedDifficulty
      );
  
      return [...matchingSelectedDifficulty];
      //return [...matchingSelectedDifficulty, ...nonMatchingSelectedDifficulty];
    }
  
    if (userLanguageLevel) {
      // If no difficulty is selected, sort by userLanguageLevel
      const matchingLanguageLevel = videos.filter(
        (video) => video.videoDifficulty === userLanguageLevel
      );
      const nonMatchingLanguageLevel = videos.filter(
        (video) => video.videoDifficulty !== userLanguageLevel
      );
  
      return [...matchingLanguageLevel, ...nonMatchingLanguageLevel];
    }
  
    // If neither selectedDifficulty nor userLanguageLevel is available, return videos as-is
    return videos;
  };
  

  return (
    <div>
      <div className='responsiveHeader2' style={{ width: '100%', justifyContent: 'space-between', padding: '5px' }}>
        <div className='responsiveHeader' >
          <div style={{ paddingLeft: '15px' }}>
            <img src={process.env.PUBLIC_URL + '/Lingorank.png'} alt="description" style={{ height: '75px', width: '180', borderRadius: '15px', cursor: 'pointer' }}
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
      <div style={{ height: '10px' }}></div>
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
                {suggestion.title}  {/* Use suggestion.title or suggestion.query here */}
              </div>
            ))}
          </div>
        </div>
      )}


      {/* DragList for selecting difficulty */}
      <DragList
        videoDifficulties={["A1", "A2", "B1", "B2", "C1", "C2"]}
        selectedDifficulty={selectedDifficulty}
        setSelectedDifficulty={setSelectedDifficulty}
      />

      {isLoading ? (
        <div style={{ background: 'red' }}><LinearProgress /></div>
      ) : (
        filteredVideos.length ?
          <Grid container spacing={2} className="special-div">
            {
              filteredVideos.map((video, index) => (
                <VideoCard key={index} video={video}></VideoCard>
              ))
            }
          </Grid>
          : showMessage && (
            <div style={{ width: '100%', textAlign: 'center', paddingTop: '40px' }}>
              <MoodBadIcon style={{ fontSize: '50px' }} />
              <div style={{ fontWeight: 'bold', fontSize: '20px' }}> Broaden your search</div>
              <div style={{ fontSize: '13px' }}>Unfortunately we did not find any results for that specific search</div>
            </div>
          ))}
    </div>
  );
};

export default SearchResults;