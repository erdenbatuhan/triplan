import React from 'react';
import { Button, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import DatePicker from '../components/DatePicker';
import SearchBar from '../components/SearchBar';
import PlaceFilter from '../components/TripPlanningPage/PlaceFilter';

const CustomGrid = styled(Grid)(() => ({
  justifyContent: 'center',
  alignItems: 'center'
}));

function MainPage() {
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
          <PlaceFilter calledFrom="MainPage" />
          <Button variant="outlined" href="/trip-planning">
            Continue
          </Button>
        </CustomGrid>
      </CustomGrid>
    </CustomGrid>
  );
}

export default MainPage;
