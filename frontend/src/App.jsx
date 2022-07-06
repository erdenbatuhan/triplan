import React, { useState, useMemo } from 'react';
import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import UserProfilePage from './pages/UserProfilePage';
import MainPage from './pages/MainPage';
import TripPlanningPage from './pages/TripPlanningPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import { UserAuthHelper } from './authentication/user-auth-helper';
import { AuthUserContext } from './authentication/AuthUserContext';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(UserAuthHelper.isLoggedIn());
  const [userUsername, setUserUsername] = useState(UserAuthHelper.getUserUsername());

  const syncAuthUser = () => {
    setIsLoggedIn(UserAuthHelper.isLoggedIn());
    setUserUsername(UserAuthHelper.getUserUsername());
  };

  const loginUser = (token) => {
    UserAuthHelper.loginUser(token);
    syncAuthUser();
  };

  const logoutUser = () => {
    UserAuthHelper.logoutUser();
    syncAuthUser();
  };

  return (
    <AuthUserContext.Provider
      value={useMemo(() => {
        return { userUsername, loginUser, logoutUser };
      }, [userUsername, loginUser, logoutUser])}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={isLoggedIn ? <HomePage /> : <LoginPage />} />
          <Route path="/signup" element={isLoggedIn ? <HomePage /> : <SignUpPage />} />
          <Route path="/user" element={isLoggedIn ? <UserProfilePage /> : <Navigate to="/" />} />
          <Route
            path="/trip-planning"
            element={isLoggedIn ? <TripPlanningPage /> : <Navigate to="/" />}
          />
          <Route path="/main-page" element={isLoggedIn ? <MainPage /> : <Navigate to="/" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthUserContext.Provider>
  );
}

export default App;
