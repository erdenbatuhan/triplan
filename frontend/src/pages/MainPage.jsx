/* eslint-disable no-unused-vars */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
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
    <CustomGrid container height="100vh" display="inline-grid">
      <CustomGrid container spacing={2} direction="row">
        <Grid item md={8}>
          <SearchBar />
        </Grid>
        <Grid item md={4}>
          <DatePicker />
        </Grid>
        <CustomGrid marginTop={2} container spacing={2} direction="column">
          <PlaceFilter calledFrom="MainPage" handleContinueClick={handleButtonClick} />
        </CustomGrid>
      </CustomGrid>
    </CustomGrid>
  );
}

export default MainPage;
