/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import Background from '../assets/main-page-background.png';
import DatePicker from '../components/DatePicker';
import SearchBar from '../components/SearchBar';
import PlaceFilter from '../components/TripPlanningPage/PlaceFilter';
import { getCityInfoByName } from '../queries/city-info-queries';
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
    navigate('/trip-planning', { state: { selectedCity, filterData } });
  };

  const handleCitySelectionChange = (newVal) => {
    setSelectedCity(newVal);
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
              <SearchBar
                label="Select a destination"
                entries={cities}
                onSelectionChange={handleCitySelectionChange}
              />
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
