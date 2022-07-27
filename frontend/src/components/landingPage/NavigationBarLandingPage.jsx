import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

const logoTransparent = require('../../assets/logo-transparent.png');

export default function LandingPageBar() {
  const handleTeamScrool = () => {
    const anchor = document.querySelector('#team');
    anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };
  const handleWhyTriplanScrol = () => {
    const anchor = document.querySelector('#whyTriplan');
    anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleContactScrol = () => {
    const anchor = document.querySelector('#contact');
    anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} position="fixed">
        <Toolbar
          sx={{
            justifyContent: 'space-between'
          }}>
          <Box display="flex" flexGrow={1} alignItems="center">
            <img src={logoTransparent} width={50} height={50} alt="" />
            <Typography
              variant="h4"
              color="#FFFFFF"
              sx={{
                fontFamily: 'sans-serif'
              }}>
              Triplan
            </Typography>
          </Box>
          <div>
            <IconButton color="inherit" size="small" onClick={handleTeamScrool}>
              About Us
            </IconButton>
            <IconButton color="inherit" size="small" onClick={handleWhyTriplanScrol}>
              Why Triplan?
            </IconButton>
            <IconButton color="inherit" size="small" onClick={handleContactScrol}>
              Contact Us
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
