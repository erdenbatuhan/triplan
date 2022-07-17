import React, { useState, useMemo } from 'react';
import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import UserProfilePage from './pages/UserProfilePage';
import MainPage from './pages/MainPage';
import TripPlanningPage from './pages/TripPlanningPage';
import RestaurantProfilePage from './pages/RestaurantProfilePage';
import TripPlanSummaryPage from './pages/TripPlanSummaryPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import Wallet from './pages/Wallet';
import { UserAuthHelper } from './authentication/user-auth-helper';
import { AuthUserContext } from './authentication/AuthUserContext';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(UserAuthHelper.isLoggedIn());
  const [authenticatedUser, setAuthenticatedUser] = useState(UserAuthHelper.getStoredUser());

  const syncAuthUser = () => {
    setIsLoggedIn(UserAuthHelper.isLoggedIn());
    setAuthenticatedUser(UserAuthHelper.getStoredUser().user);
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
        return { authenticatedUser, loginUser, logoutUser };
      }, [authenticatedUser, loginUser, logoutUser])}>
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
          <Route
            path="/trip-plan/:tripPlanId/summary"
            element={isLoggedIn ? <TripPlanSummaryPage /> : <Navigate to="/" />}
          />
          <Route path="/main-page" element={isLoggedIn ? <MainPage /> : <Navigate to="/" />} />
          <Route path="/wallet" element={isLoggedIn ? <Wallet /> : <Navigate to="/" />} />
          <Route
            path="/restaurant-profile/:restaurantId"
            element={isLoggedIn ? <RestaurantProfilePage /> : <Navigate to="/" />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthUserContext.Provider>
  );
}

export default App;
