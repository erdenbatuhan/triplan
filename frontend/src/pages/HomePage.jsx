import React, { useContext } from 'react';
import { Button } from '@mui/material';
import logo from '../logo.svg';
import { AuthUserContext } from '../authentication/AuthUserContext';
import '../App.css';

function HomePage() {
  const authContext = useContext(AuthUserContext);
  const handleLogOut = () => {
    authContext.logoutUser();
  };
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer">
          Learn React
        </a>
        <br />
        <Button href="/login">Login</Button>
        <Button href="/signup">Sign Up</Button>
        <Button href="/" onClick={handleLogOut}>
          Log Out
        </Button>
      </header>
    </div>
  );
}

export default HomePage;
