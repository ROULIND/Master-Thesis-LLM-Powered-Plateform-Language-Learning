import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import RequireAuth from './components/RequireAuth'; // Adjust path if necessary

import HomePageVideos from './Screens/HomePage';
import UniqueVideo from './Screens/UniqueVideo';
import SearchResults from './Screens/SearchResults';
import Register from './Screens/UserScreens/Register';
import Login from './Screens/UserScreens/Login';
import TestLogin from './Screens/UserScreens/TestLogin';
import UserInfo from './Screens/UserScreens/UserInfo';
import CreateNewAccount from './Screens/UserScreens/CreateNewAccount';
import Test from './Screens/UserScreens/Test';
import Onboarding from './Screens/UserScreens/Onboarding';
import Chatbot from './Screens/Chatbot';

function App() {
  return (
    <div>
      <Router>
        <div className="main-content">
          <div style={{ width: '100%', height: '50px' }}></div>
          <Routes>
            {/* Public routes */}
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/users/register" element={<Register />} />
            <Route path="/users/new" element={<CreateNewAccount />} />
            <Route path="/users/login" element={<Login />} />

            {/* Protected routes */}
            <Route
              path="/"
              element={
                <RequireAuth>
                  <HomePageVideos />
                </RequireAuth>
              }
            />
            <Route
              path="/:videoId"
              element={
                <RequireAuth>
                  <UniqueVideo />
                </RequireAuth>
              }
            />
            <Route
              path="/youtube-videos/search-results"
              element={
                <RequireAuth>
                  <SearchResults />
                </RequireAuth>
              }
            />
            <Route
              path="/testss"
              element={
                <RequireAuth>
                  <TestLogin />
                </RequireAuth>
              }
            />
            <Route
              path="/users/info"
              element={
                <RequireAuth>
                  <UserInfo />
                </RequireAuth>
              }
            />
            <Route
              path="/test"
              element={
                <RequireAuth>
                  <Test />
                </RequireAuth>
              }
            />
            <Route
              path="/chatbot"
              element={
                <RequireAuth>
                  <Chatbot />
                </RequireAuth>
              }
            />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
