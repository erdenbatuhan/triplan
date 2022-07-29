import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, FormControlLabel, Switch, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import DatePicker from '../components/DatePicker';
import SearchBar from '../components/SearchBar';
import { getCities } from '../queries/partner-location-queries';
import FilterBox from '../components/common/FilterBox';
import * as constants from '../shared/constants';

const CustomGrid = styled(Grid)(() => ({
  justifyContent: 'center',
  alignItems: 'center'
}));

export default function MainPage() {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [cuisines, setCuisines] = useState([]);
  const [foodTypes, setFoodTypes] = useState([]);
  const [priceLevels, setPriceLevels] = useState([]);
  const [touristAttractionTypes, setTouristAttractionTypes] = useState();
  const [isRestaurantEnabled, setIsRestaurantEnabled] = useState(true);

  useEffect(() => {
    getCities().then((data) => setCities(data));
  }, []);

  const navigate = useNavigate();
  const handleButtonClick = () => {
    const filterData = {
      filterData: {
        restaurantFilter: isRestaurantEnabled
          ? { cuisines, foodTypes, priceLevels }
          : constants.EMPTY_FILTER.filterData.restaurantFilter,
        touristAttractionFilter: { types: touristAttractionTypes }
      }
    };

    if (!selectedCity) {
      alert('city selection is mandatory');
      return;
    }

    navigate('/trip-plan', {
      state: { selectedCity, isRestaurantEnabled, filterData }
    });
  };

  const handleCitySelectionChange = (updatedCitySelection) => {
    setSelectedCity(updatedCitySelection);
  };

  const handleCuisinesChange = (updatedCuisines) => {
    setCuisines(updatedCuisines);
  };

  const handleFoodTypesChange = (updatedFoodTypes) => {
    setFoodTypes(updatedFoodTypes);
  };

  const handlePriceLevelsChange = (updatedPriceLevels) => {
    setPriceLevels(updatedPriceLevels);
  };

  const handleTouristAttractionTypesChange = (updatedTouristAttractionTypes) => {
    setTouristAttractionTypes(updatedTouristAttractionTypes);
  };

  return (
    <Box
      sx={{
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        height: '92.5vh',
        overflow: 'hidden'
      }}>
      <CustomGrid container spacing={0} direction="column" paddingTop="8%">
        <Grid container spacing={2}>
          <Grid item xs={2} />

          <Grid item xs={4}>
            <SearchBar
              label="Select a destination"
              entries={cities}
              onSelectionChange={handleCitySelectionChange}
            />
          </Grid>

          <Grid item xs={2} textAlign="center">
            <FormControlLabel
              control={
                <Switch
                  onChange={() => setIsRestaurantEnabled(!isRestaurantEnabled)}
                  checked={isRestaurantEnabled}
                  color="primary"
                />
              }
              label="Looking for restaurants as well?"
              labelPlacement="top"
            />
          </Grid>

          <Grid item xs={2} textAlign="center">
            <DatePicker />
          </Grid>

          <Grid item xs={2} />
        </Grid>

        <Grid sx={{ mt: 2, mb: 2 }} container>
          <Grid item xs={2} />

          <Grid item xs={8}>
            <hr sx={{ width: '100%' }} />
          </Grid>

          <Grid item xs={2} />
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={2} />

          <Grid item xs={2}>
            <FilterBox
              label="Types of Places"
              options={constants.TOURIST_ATTRACTION_TYPE_MAP}
              nameKey="name"
              valueKey="value"
              selections={touristAttractionTypes}
              onSelectionChange={handleTouristAttractionTypesChange}
            />
          </Grid>

          <Grid item xs={2}>
            <FilterBox
              label="Cuisines"
              options={constants.CUISINES}
              onSelectionChange={handleCuisinesChange}
              disabled={!isRestaurantEnabled}
            />
          </Grid>

          <Grid item xs={2}>
            <FilterBox
              label="Price Levels"
              options={constants.PRICE_LEVELS}
              onSelectionChange={handlePriceLevelsChange}
              disabled={!isRestaurantEnabled}
            />
          </Grid>

          <Grid item xs={2}>
            <FilterBox
              label="Diet Options"
              options={constants.FOOD_TYPES}
              onSelectionChange={handleFoodTypesChange}
              disabled={!isRestaurantEnabled}
            />
          </Grid>

          <Grid item xs={2} />
        </Grid>

        <Grid sx={{ mt: 4, mb: 2 }} container textAlign="center">
          <Grid item xs={5} />

          <Grid item xs={2}>
            <Button
              sx={{ width: '100%', background: 'white' }}
              fontSize="large"
              variant="outlined"
              onClick={handleButtonClick}>
              Continue
            </Button>
          </Grid>

          <Grid item xs={5} />
        </Grid>
      </CustomGrid>
    </Box>
  );
}
