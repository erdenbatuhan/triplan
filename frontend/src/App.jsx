import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
// import logo from './logo.svg';
// import './App.css';
import HomePage from './pages/HomePage';
import UserProfilePage from './pages/UserProfilePage';

function App() {
  return (
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer">
    //       Learn React
    //     </a>
    //   </header>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" />
        <Route path="/user" element={<UserProfilePage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
    // </div>
  );
}

export default App;
