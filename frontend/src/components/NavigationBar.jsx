import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';
import { UserAuthHelper } from '../authentication/user-auth-helper';

export default function MenuAppBar() {
  const [authenticatedUser] = useState(UserAuthHelper.getStoredUser());
  const [anchorEl, setAnchorEl] = useState(null);

  const navigate = useNavigate();

  const handleLogout = () => {
    // logout function will be added
    navigate('/login');
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigateProfile = () => {
    navigate('/user');
  };

  const navigateWallet = () => {
    navigate('/wallet');
  };

  const navigateMainPage = () => {
    navigate('/main-page');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar sx={{ bgcolor: '#42a5f5' }} position="static">
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>

          <IconButton size="large" color="inherit" onClick={navigateMainPage}>
            <HomeIcon />
          </IconButton>

          {authenticatedUser ? (
            <div>
              <IconButton
                size="large"
                aria-label="current user"
                aria-controls="user-menu-options"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit">
                <AccountCircle />
              </IconButton>

              <Menu
                id="user-menu-options"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}>
                <MenuItem onClick={navigateProfile}>Profile</MenuItem>
                <MenuItem onClick={navigateWallet}>Wallet</MenuItem>
                <MenuItem onClick={handleLogout}>Log out</MenuItem>
              </Menu>
            </div>
          ) : (
            <div>
              <IconButton color="inherit" size="small">
                Log in
              </IconButton>
              <IconButton color="inherit" size="small">
                {' '}
                Sign up{' '}
              </IconButton>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
