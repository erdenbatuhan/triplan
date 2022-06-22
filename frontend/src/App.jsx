import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import DatePicker from './components/DatePicker';
import SearchBar from './components/SearchBar';
import HomePage from './pages/HomePage';
import UserProfilePage from './pages/UserProfilePage';
import MainPage from './pages/MainPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" />
        <Route path="/user" element={<UserProfilePage />} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/search" element={<SearchBar />} />
        <Route path="/date" element={<DatePicker />} />
        <Route path="/main-page" element={<MainPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
