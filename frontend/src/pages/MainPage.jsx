/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
// import e from 'cors';
import Background from '../assets/main-page-background.png';
import DatePicker from '../components/DatePicker';
import SearchBar from '../components/SearchBar';
import PlaceFilter from '../components/TripPlanningPage/PlaceFilter';
// import { getCityInfoByName } from '../queries/city-info-queries';
import { getCities } from '../queries/partner-location-queries';

const CustomGrid = styled(Grid)(() => ({
  justifyContent: 'center',
  alignItems: 'center'
}));

export default function MainPage() {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');

  useEffect(() => {
    getCities().then((data) => setCities(data));
  }, []);

  const navigate = useNavigate();
  const handleButtonClick = (filterData) => {
    if (!selectedCity || selectedCity === '') {
      console.log('city selection is mandatory'); // error log
    } else if (
      filterData.filterData.restaurantFilter.cuisines.length === 0 &&
      filterData.filterData.restaurantFilter.foodTypes.length === 0 &&
      filterData.filterData.restaurantFilter.priceLevel.length === 0 &&
      filterData.filterData.touristAttractionFilter.types[0].length === 0
    ) {
      console.log('choosing filter is mandatory');
    } else {
      navigate('/trip-planning', { state: { selectedCity, filterData } });
    }
  };

  const handleCitySelectionChange = (newVal) => {
    setSelectedCity(newVal);
  };

  return (
    <Box
      sx={{
        backgroundImage: `url(${Background})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        height: '92.5vh',
        overflow: 'hidden'
      }}>
      <CustomGrid container spacing={0} direction="column" paddingTop="12%">
        <CustomGrid item width="85%" md={4}>
          <CustomGrid
            container
            spacing={2}
            direction="row"
            sx={{ minWidth: 890, width: '75%', marginLeft: '15%' }}>
            <Grid item md={8}>
              <SearchBar
                label="Select a destination"
                entries={cities}
                onSelectionChange={handleCitySelectionChange}
              />
            </Grid>
            <Grid item md={4}>
              <DatePicker />
            </Grid>
          </CustomGrid>
        </CustomGrid>
        <CustomGrid item width="85%" md={8} marginTop={2}>
          <PlaceFilter calledFrom="MainPage" handleContinueClick={handleButtonClick} />
        </CustomGrid>
      </CustomGrid>
    </Box>
  );
}
