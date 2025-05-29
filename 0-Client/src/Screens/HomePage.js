import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'react-loading-skeleton/dist/skeleton.css';
import { Grid } from '@mui/material';
import { Select, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import LinearProgress from '@mui/material/LinearProgress';
// Local Components
import VideoCard from '../components/Cards/VideoCard';
import ListFilters from '../components/Filters/ListFilters';
// Icons
import TuneIcon from '@mui/icons-material/Tune';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import FilterDialog from '../components/Filters/FilterDialog';
import UserMenu from '../components/UserMenu';
// CSS
import './GetVideos.css';
// User Login
import { auth } from '../firebase';
import {
  getVisitedVideos,
  addCategoryOfInterest,
  getUserCategoriesOfInterest,
  getUserLanguageLevel,
  clearVisitedVideos,
  getUserLearningLanguage
} from '../firebaseFunction';
import SearchBar from '../components/searchBar';
// API URL
import SkeletonCard from '../components/SkeletonCard';
import { handleSearch, handleInputChange } from './searchFunctions';
import { se } from 'date-fns/locale';
import { grey } from '@mui/material/colors';

const apiUrl = process.env.REACT_APP_API_URL;
const MY_UID = 'N0GWo07DFDbe5oiUXU1S5ekSw9s1'; // Replace with your Firebase UID


// Home Page
const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allVideos, setAllVideos] = useState([]);
  const [userCategories, setUserCategories] = useState([]);
  const [userLanguageLevel, setUserLanguageLevel] = useState(null);
  const uniqueCategories = [...new Set(allVideos.map((video) => video.category))];
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [videoDifficulties, setVideoDifficulties] = useState([]);
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [selectedPublishTime, setSelectedPublishTime] = useState(null);
  const [videoCategories, setVideoCategories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [videoDurations, setVideoDurations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [historicVideos, setHistoricVideos] = useState([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
 


  // New state for language filter (values: "fr", "de", "en")
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  // New state for selected tab
  const [selectedTab, setSelectedTab] = useState('Accueil');

  

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

   // HEADINGS ONLY IF: no category selected AND no filter set
  const showHeadings =
    !selectedCategory &&            // no topic
    !selectedDifficulty &&          // no difficulty filter
    !selectedDuration &&            // no duration filter
    !selectedPublishTime &&         // no date filter
    selectedTab === 'Accueil';      // and we’re on the home tab

  useEffect(() => {
    // Check if a user is already authenticated
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        
        // Fetch user learning language when user is authenticated
        const fetchUserLearningLanguage = async () => {
          const learningLanguage = await getUserLearningLanguage(user.uid);
          setSelectedLanguage(learningLanguage);
          console.log('User :', user.uid);
          console.log('User learning language:', learningLanguage);
          console.log('Selected language:', selectedLanguage);
        };
        fetchUserLearningLanguage();
        

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

        // Fetch visited videos when user is authenticated
        const fetchVisitedVideos = async () => {
          const visitedVideos = await getVisitedVideos(user.uid);
          console.log('Visited videos:', visitedVideos);
          axios
            .get(`${apiUrl}/storage/videos`)
            .then((response) => {
              const videosArray = response.data;
              const filteredVideos = videosArray.filter((video) =>
                visitedVideos.includes(video.videoId)
              );
              setHistoricVideos(filteredVideos);
            })
            .catch((error) => {
              console.error('Error fetching videos:', error);
            });
        };
        fetchVisitedVideos();
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe(); // Clean up the subscription on component unmount
  }, []);

  const handleDifficultyChange = (event) => {
    setSelectedDifficulty(event.target.value);
  };

  const navigate = useNavigate();

  const backToHome = () => {
    let path = `/`;
    navigate(path);
  };

  const handleDurationChange = (event) => {
    setSelectedDuration(event.target.value);
  };

  const handleVideoCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handlePublishTimeChange = (event) => {
    setSelectedPublishTime(event.target.value);
  };

  // New: Handler for language change
  const handleLanguageChange = (event) => {
    //setSelectedLanguage(event.target.value);
    console.log('Change Selected language:', event.target.value);
  };

  useEffect(() => {
    if (selectedLanguage) {
      const filteredVideos = allVideos.filter(
        (video) => video.videoLanguage === selectedLanguage
      );
      setVideos(filteredVideos);
    } else {
      setVideos(allVideos); // Reset to show all if no language is selected
    }
  }, [selectedLanguage, allVideos]); // Re-run when selectedLanguage or allVideos changes
  

  // Assuming `videos` is the array with all fetched videos
  // 👇 replace your current sortVideos with this version
  const sortVideos = (videos) => {
    videos = videos.filter((v) => v.videoLanguage === selectedLanguage);

    if (!userCategories || !userLanguageLevel) {
      // user not logged-in (or no prefs) → just one list, no headings
      return {
        interestVideos: videos.sort(
          (a, b) => new Date(b.publishTime) - new Date(a.publishTime)
        ),
        seenVideos: [],
        exploreVideos: [],
      };
    }

    // buckets
    const categoriesWithUserLevel = [];
    const categoriesWithoutUserLevel = [];
    const seenVideos = [];
    const otherCategoriesWithUserLevel = [];
    const otherCategoriesWithoutUserLevel = [];

    videos.forEach((video) => {
      const isCategoryMatch = userCategories.includes(video.category);
      const isLevelMatch   = video.videoDifficulty === userLanguageLevel;
      const isSeen         = historicVideos.some(
        (h) => h.videoId === video.videoId
      );

      if (isCategoryMatch && isLevelMatch && !isSeen) {
        categoriesWithUserLevel.push(video);
      } else if (isCategoryMatch && !isLevelMatch && !isSeen) {
        categoriesWithoutUserLevel.push(video);
      } else if (isSeen) {
        seenVideos.push(video);
      } else if (!isCategoryMatch && isLevelMatch && !isSeen) {
        otherCategoriesWithUserLevel.push(video);
      } else {
        otherCategoriesWithoutUserLevel.push(video);
      }
    });

    const byNewest = (arr) =>
      arr.sort((a, b) => new Date(b.publishTime) - new Date(a.publishTime));

    return {
      interestVideos: [
        ...byNewest(categoriesWithUserLevel),
        ...byNewest(categoriesWithoutUserLevel),
      ],
      seenVideos: byNewest(seenVideos),
      exploreVideos: [
        ...byNewest(otherCategoriesWithUserLevel),
        ...byNewest(otherCategoriesWithoutUserLevel),
      ],
    };
  };


  useEffect(() => {
    setLoading(true);

    axios
      .get(`${apiUrl}/storage/videos`)
      .then((response) => {
        const fetchedVideos = response.data; // Assuming response.data is an array of videos

        const uniqueDifficulties = [
          ...new Set(fetchedVideos.map((video) => video.videoDifficulty)),
        ];
        const uniqueDurations = [
          ...new Set(fetchedVideos.map((video) => video.videoDuration)),
        ];

        // Extracting unique categories from fetchedVideos
        const uniqueCategories = [
          ...new Set(fetchedVideos.map((video) => video.category)),
        ];

        setVideos(fetchedVideos);
        setAllVideos(fetchedVideos);
        setVideoDifficulties(uniqueDifficulties);
        setVideoDurations(uniqueDurations);
        setVideoCategories(uniqueCategories); // Set the unique categories to state

        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching videos:', error);
        setLoading(false);
      });
  }, []);

  // Modify displayedVideos based on selectedTab and user status
  let interestVideos = [];
  let seenVideos     = [];
  let exploreVideos  = [];

  if (selectedTab === 'Accueil') {
    const sorted = sortVideos(videos);
    interestVideos = sorted.interestVideos;
    seenVideos     = sorted.seenVideos;
    exploreVideos  = sorted.exploreVideos;
  } else if (selectedTab === 'Historique') {
    // unchanged
    interestVideos = [...historicVideos].reverse();
  }


  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setTimeout(() => {
      const filteredVideos = category
        ? allVideos.filter((video) => video.category === category)
        : allVideos;

      setVideos(filteredVideos);
    }, 100);
  };

  const handleApplyFilter = () => {
    let filteredVideos = allVideos;

    if (selectedDifficulty) {
      filteredVideos = filteredVideos.filter(
        (video) => video.videoDifficulty === selectedDifficulty
      );
    }

    if (selectedDuration) {
      const [minDuration, maxDuration] = selectedDuration.split('-');
      filteredVideos = filteredVideos.filter((video) => {
        const duration = parseFloat(video.videoDuration);
        return (
          duration >= parseFloat(minDuration) && duration <= parseFloat(maxDuration)
        );
      });
    }

    if (selectedCategory) {
      filteredVideos = filteredVideos.filter(
        (video) => video.category === selectedCategory
      );
    }

    // NEW: Filter videos by language if a language is selected
    if (selectedLanguage) {
      filteredVideos = filteredVideos.filter(
        (video) => video.videoLanguage === selectedLanguage
      );
    }

    if (selectedPublishTime) {
      const now = new Date();
      let dateFilter;

      switch (selectedPublishTime) {
        case 'today':
          dateFilter = new Date(now);
          dateFilter.setHours(0, 0, 0, 0); // Set time to the beginning of the day
          break;
        case 'thisWeek':
          dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'thisMonth':
          dateFilter = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'thisYear':
          dateFilter = new Date(now.getFullYear(), 0, 1);
          break;
        case 'moreThanYear':
          dateFilter = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
          filteredVideos = filteredVideos.filter(
            (video) => new Date(video.publishTime) < dateFilter
          );
          break;
        default:
          break;
      }

      if (selectedPublishTime !== 'moreThanYear') {
        filteredVideos = filteredVideos.filter(
          (video) => new Date(video.publishTime) >= dateFilter
        );
      }
    }

    setVideos(filteredVideos);
    setSelectedDuration(null);
    setSelectedCategory(null);
    setSelectedPublishTime(null);
    setSelectedDifficulty(null);
    setIsDialogOpen(false);
  };

  useEffect(() => {
    const container = document.getElementById('list-container');
    if (container) {
      // Optionally do something with the container
    }
  }, []);

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setQuery(suggestion);
    setSuggestions([]);
  };

  const handleQueryChange = (event) => {
    console.log('Selected language:', selectedLanguage);
    handleInputChange(event, setQuery, setSuggestions, selectedLanguage);
  };
  

  const handleSearchSubmit = () => {
    handleSearch(query, setSearchResults, navigate, setIsLoading, setError);
  };

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
                height: '75px',
                width: '180px',
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
          >
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <SearchBar
                    query={query}
                    handleInputChange={handleQueryChange}
                    handleSearch={handleSearchSubmit}
                  />
                  <TuneIcon
                    onClick={() => setIsDialogOpen(true)}
                    style={{
                      cursor: 'pointer',
                      fontSize: '25px',
                      marginLeft: '20px',
                      color: '#555',
                    }}
                  />
                </div>
              </div>

              <FilterDialog
                isOpen={isDialogOpen}
                handleClose={() => setIsDialogOpen(false)}
                videoDifficulties={videoDifficulties}
                selectedDifficulty={selectedDifficulty}
                handleDifficultyChange={handleDifficultyChange}
                handleDurationChange={handleDurationChange}
                selectedDuration={selectedDuration}
                handleApplyFilter={handleApplyFilter}
                videoCategories={videoCategories} // Pass videoCategories here
                selectedCategory={selectedCategory} // Add selectedCategory prop
                handleCategoryChange={handleCategoryChange} // Add handleCategoryChange prop
                selectedPublishTime={selectedPublishTime} // Add selectedPublishTime prop
                handlePublishTimeChange={handlePublishTimeChange} // Add handlePublishTimeChange prop
                selectedLanguage={selectedLanguage}           // New prop for language filter
                handleLanguageChange={handleLanguageChange}       // New handler for language filter
              />
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

        {/* Suggestions for autocomplete */}
        {suggestions.length > 0 && (
          <div className="suggestion-overlay">
            <div className="suggestion-box">
              {suggestions.slice(0, 15).map((suggestion, index) => (
                <div
                  key={index}
                  style={{
                    cursor: 'pointer',
                    height: '40px',
                    overflowY: 'auto',
                    borderRadius: '4px',
                    fontSize: '15px',
                  }}
                  onClick={() => {
                    handleSuggestionClick(suggestion.title);
                  }}
                >
                  {suggestion.title}
                </div>
              ))}
            </div>
          </div>
        )}

        {error && <p>{error}</p>}
        <div style={{ height: '20px' }}>
          {isLoading ? <LinearProgress /> : <div></div>}
        </div>
        <div
          style={{
            position: 'sticky',
            paddingTop: '20px',
            paddingBottom: '20px',
            top: 0,
            background: 'white',
          }}
        >
          <ListFilters
            videoDifficulties={uniqueCategories}
            handleCategoryChange={handleCategoryChange}
            setSelectedDifficulty={setSelectedDifficulty}
          />
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
            <p style={{ margin: '20px' }}>Accueil</p>
          </div>
          {user && (
            <div
              onClick={() => handleTabClick('Historique')}
              style={{
                cursor: 'pointer',
                fontWeight: selectedTab === 'Historique' ? 'bold' : 'normal',
              }}
            >
              <p style={{ margin: '20px' }}>Historique</p>
            </div>
          )}
        </div>


       
        {/* Main Video Content */}
        <div style={{ flex: 1 }}>
          {loading ? (
            <Grid container spacing={2} className="special-div">
              {[...Array(10)].map((_, i) => (
                <div key={i} style={{ flex: '5 100 1%', width: '100%', padding: 0 }}>
                  <SkeletonCard />
                </div>
              ))}
            </Grid>
          ) : showHeadings ? (
            /* ───────────── show 3 titled groups ───────────── */
            <>
              {interestVideos.length > 0 && (
                <>
                  <h4 style={{ marginTop: 0 }}>Videos that might interest you</h4>
                  <Grid container spacing={2} className="special-div">
                    {interestVideos.map((v) => (
                      <VideoCard key={v.videoId} video={v} />
                    ))}
                  </Grid>
                </>
              )}

              {seenVideos.length > 0 && (
                <>
                  <h4 style={{ marginTop: 40 }}>See again video</h4>
                  <Grid container spacing={2} className="special-div">
                    {seenVideos.map((v) => (
                      <VideoCard key={v.videoId} video={v} />
                    ))}
                  </Grid>
                </>
              )}

              {exploreVideos.length > 0 && (
                <>
                  <h4 style={{ marginTop: 40 }}>Explore other videos</h4>
                  <Grid container spacing={2} className="special-div">
                    {exploreVideos.map((v) => (
                      <VideoCard key={v.videoId} video={v} />
                    ))}
                  </Grid>
                </>
              )}
            </>
          ) : (
            /* ───────────── any filter active → flat list without headings ───────────── */
            <Grid container spacing={2} className="special-div">
              {[...interestVideos, ...seenVideos, ...exploreVideos].map((v) => (
                <VideoCard key={v.videoId} video={v} />
              ))}
            </Grid>
          )}

          {/* Clear-history button (unchanged) */}
          {selectedTab === 'Historique' && historicVideos.length > 0 && (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              {user && (
                <button
                  onClick={async () => {
                    await clearVisitedVideos(user.uid);
                    window.location.reload();
                  }}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#e38940',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '16px',
                  }}
                >
                  Clear History
                </button>
              )}
            </div>
          )}
        </div>

        {/* End of Main Video Content */}
      </div>
    </div>
  );
};

export default HomePage;
