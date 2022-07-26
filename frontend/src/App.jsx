import React, { useState, useMemo } from 'react';
import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
// import HomePage from './pages/HomePage';
import UserProfilePage from './pages/UserProfilePage';
import MainPage from './pages/MainPage';
import TripPlanningPage from './pages/TripPlanningPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import WalletPage from './pages/WalletPage';
import AdminPage from './pages/AdminPage';
import AdminLoginPage from './pages/AdminLoginPage';
import { UserAuthHelper } from './authentication/user-auth-helper';
import { AuthUserContext } from './authentication/AuthUserContext';
import PartnerLocationProfilePage from './pages/PartnerLocationProfilePage';
import EditPartnerLocationProfilePage from './pages/EditPartnerLocationProfilePage';
import LandingPage from './pages/LandingPage';

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
  const { pathname } = window.location;

  console.log(pathname);

  return (
    <AuthUserContext.Provider
      value={useMemo(() => {
        return { authenticatedUser, loginUser, logoutUser };
      }, [authenticatedUser, loginUser, logoutUser])}>
      <BrowserRouter>
        {pathname !== '/' ? <NavigationBar /> : <div />}

        <Routes>
          <Route path="/" element={<LandingPage />} />
          {/* <Route path="/login" element={isLoggedIn ? <HomePage /> : <LoginPage />} />
          <Route path="/signup" element={isLoggedIn ? <HomePage /> : <SignUpPage />} /> */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/user" element={isLoggedIn ? <UserProfilePage /> : <Navigate to="/" />} />
          <Route
            path="/trip-plan"
            element={isLoggedIn ? <TripPlanningPage /> : <Navigate to="/" />}
          />
          <Route
            path="/trip-plan/:tripPlanId/checkout"
            element={isLoggedIn ? <CheckoutPage /> : <Navigate to="/" />}
          />
          <Route path="/main-page" element={isLoggedIn ? <MainPage /> : <Navigate to="/" />} />
          <Route path="/wallet" element={isLoggedIn ? <WalletPage /> : <Navigate to="/" />} />
          <Route
            path="/partner-profile/:partnerId"
            element={isLoggedIn ? <PartnerLocationProfilePage /> : <Navigate to="/" />}
          />
          <Route
            path="/edit-partner-profile/:partnerId"
            element={isLoggedIn ? <EditPartnerLocationProfilePage /> : <Navigate to="/" />}
          />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin-login" element={<AdminLoginPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthUserContext.Provider>
  );
}
