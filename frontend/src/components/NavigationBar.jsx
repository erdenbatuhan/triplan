import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
// import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import { styled, alpha } from '@mui/material/styles';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Typography from '@mui/material/Typography';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserAuthHelper } from '../authentication/user-auth-helper';
import { PRIMARY_COLOR } from '../shared/constants';

const logo = require('../assets/triplan_logo.png');

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.45),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.65)
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: '50ch'
  }
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch'
    }
  }
}));

export default function MenuAppBar() {
  // const [authenticatedUser, setAuthenticatedUser] = useState(UserAuthHelper.getStoredUser());
  const [isLoggedIn, setIsLoggedIn] = useState(UserAuthHelper.isLoggedIn());
  const [anchorEl, setAnchorEl] = useState(null);

  const { state } = useLocation(); // Received from the previous route
  console.log(isLoggedIn);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoggedIn(UserAuthHelper.isLoggedIn());
  }, [state]);

  // const syncAuthUser = () => {
  //   setIsLoggedIn(UserAuthHelper.isLoggedIn());
  // };

  const handleLogOut = () => {
    UserAuthHelper.logoutUser();
    // syncAuthUser();
    navigate('/login');
  };
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigateToProfile = () => {
    navigate('/user');
  };

  const navigateToWallet = () => {
    navigate('/wallet');
  };

  const navigateToMainPage = () => {
    navigate('/');
  };

  const navigateToLogin = () => {
    navigate('/login');
  };

  const navigateToSignup = () => {
    navigate('/signup');
  };

  // useEffect(() => {
  //   syncAuthUser();
  // }, [isLoggedIn]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar sx={{ bgcolor: PRIMARY_COLOR }} position="fixed">
        <Toolbar
          sx={{
            justifyContent: 'space-between'
          }}>
          <Box display="flex" flexGrow={1} alignItems="center">
            <img src={logo} width={50} height={50} alt="" />
            <Typography
              variant="h4"
              color="#FFFFFF"
              sx={{
                fontFamily: 'sans-serif'
              }}>
              Triplan
            </Typography>
          </Box>
          <Box display="flex" flexGrow={1} alignItems="center">
            <Search sx={{ justifyContent: 'space-between' }}>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase placeholder="Search…" inputProps={{ 'aria-label': 'search' }} />
            </Search>
          </Box>

          {/* <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton> */}

          <IconButton size="large" color="inherit" onClick={navigateToMainPage}>
            <HomeIcon />
          </IconButton>

          {isLoggedIn ? (
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
                <MenuItem onClick={navigateToProfile}>Profile</MenuItem>
                <MenuItem onClick={navigateToWallet}>Wallet</MenuItem>
                <MenuItem onClick={handleLogOut}>Log out</MenuItem>
              </Menu>
            </div>
          ) : (
            <div>
              <IconButton color="inherit" size="small" onClick={navigateToLogin}>
                Log in
              </IconButton>
              <IconButton color="inherit" size="small" onClick={navigateToSignup}>
                Sign up
              </IconButton>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
