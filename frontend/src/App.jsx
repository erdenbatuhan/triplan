import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import UserProfilePage from './pages/UserProfilePage';
import MainPage from './pages/MainPage';
import TripPlanningPage from './pages/TripPlanningPage';
import Wallet from './pages/Wallet';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" />
        <Route path="/user" element={<UserProfilePage />} />
        <Route path="/trip-planning" element={<TripPlanningPage />} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/main-page" element={<MainPage />} />
        <Route path="/wallet" element={<Wallet />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
