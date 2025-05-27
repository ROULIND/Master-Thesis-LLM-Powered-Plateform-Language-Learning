import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Accueil from './components/DashboardHome';
import SidebarToggle from './components/SidebarToggle';
import Sidebar from './components/Sidebar';
import AccueilVideos from './YoutubeVideos/AccueilVideos';
import DisplayVideos from './YoutubeVideos/DisplayVideos'
import AddVideos from './YoutubeVideos/AddVideos'
import AddVideoId from './YoutubeVideos/AddVideoId'

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className={`app-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <Router>
  
        <SidebarToggle isOpen={isSidebarOpen} onToggle={toggleSidebar} />
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
        <div className="main-content">
        <div style={{width:'100%',background:'#c32f27',height:'50px'}}>
        </div>
          <Routes>
            <Route path="/" element={<Accueil />} /> {/* Checked */}
            <Route path="/youtube-videos/accueil" element={<AccueilVideos />} /> {/* Checked */}
            <Route path="/youtube-videos/edit"element={<DisplayVideos />} /> {/* Checked */}
            <Route path="/youtube-videos/add" element={<AddVideos />} />{/* Checked */}
            <Route path="/youtube-videos/add-video-id" element={<AddVideoId />} /> {/* Checked */}
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;