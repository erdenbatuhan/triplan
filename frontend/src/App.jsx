import React, { useState, useMemo } from 'react';
import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
// import HomePage from './pages/HomePage';
import UserProfilePage from './pages/UserProfilePage';
import MainPage from './pages/MainPage';
import TripPlanningPage from './pages/TripPlanningPage';
import CheckoutPage from './pages/CheckoutPage';
import TripPlanSummaryPage from './pages/TripPlanSummaryPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import WalletPage from './pages/WalletPage';
import { UserAuthHelper } from './authentication/user-auth-helper';
import { AuthUserContext } from './authentication/AuthUserContext';
import PartnerLocationProfilePage from './pages/PartnerLocationProfilePage';
import EditPartnerLocationProfilePage from './pages/EditPartnerLocationProfilePage';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(UserAuthHelper.isLoggedIn());
  // const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [authenticatedUser, setAuthenticatedUser] = useState(UserAuthHelper.getStoredUser());
  console.log('App, ', isLoggedIn);

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
        <NavigationBar />

        <Routes>
          <Route path="/" element={isLoggedIn ? <MainPage /> : <LoginPage />} />
          {/* <Route path="/login" element={isLoggedIn ? <HomePage /> : <LoginPage />} />
          <Route path="/signup" element={isLoggedIn ? <HomePage /> : <SignUpPage />} /> */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/user" element={isLoggedIn ? <UserProfilePage /> : <Navigate to="/" />} />
          <Route
            path="/trip-planning"
            element={isLoggedIn ? <TripPlanningPage /> : <Navigate to="/" />}
          />
          <Route path="/checkout" element={isLoggedIn ? <CheckoutPage /> : <Navigate to="/" />} />
          <Route
            path="/trip-plan/:tripPlanId/summary"
            element={isLoggedIn ? <TripPlanSummaryPage /> : <Navigate to="/" />}
          />
          {/* <Route path="/main-page" element={isLoggedIn ? <MainPage /> : <Navigate to="/" />} /> */}
          <Route path="/wallet" element={isLoggedIn ? <WalletPage /> : <Navigate to="/" />} />
          <Route
            path="/partner-profile/:partnerId"
            element={isLoggedIn ? <PartnerLocationProfilePage /> : <Navigate to="/" />}
          />
          <Route
            path="/edit-partner-profile/:partnerId"
            element={isLoggedIn ? <EditPartnerLocationProfilePage /> : <Navigate to="/" />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthUserContext.Provider>
  );
}
