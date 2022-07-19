/* eslint-disable no-unused-vars */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import Background from '../assets/main-page-background.png';
import DatePicker from '../components/DatePicker';
import SearchBar from '../components/SearchBar';
import PlaceFilter from '../components/TripPlanningPage/PlaceFilter';

const CustomGrid = styled(Grid)(() => ({
  justifyContent: 'center',
  alignItems: 'center'
}));

function MainPage() {
  const navigate = useNavigate();
  const handleButtonClick = (filterData) => {
    navigate('/trip-planning', { state: filterData });
  };

  return (
    <div
      style={{
        backgroundImage: `url(${Background})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
      }}>
      <CustomGrid container height="100vh" display="inline-grid">
        <CustomGrid container spacing={2} direction="row" display="flex">
          <CustomGrid container spacing={2} direction="row" display="flex">
            <Grid item md={8} flex-direction="column">
              <SearchBar />
            </Grid>
            <Grid item md={4} flex-direction="column">
              <DatePicker />
            </Grid>
          </CustomGrid>
          <CustomGrid marginTop={2} container spacing={2} direction="column">
            <PlaceFilter calledFrom="MainPage" handleContinueClick={handleButtonClick} />
          </CustomGrid>
        </CustomGrid>
      </CustomGrid>
    </div>
  );
}

export default MainPage;
