import React, { useState } from 'react';
import { Box } from '@mui/material';
import SelectCuisines from './SelectCuisines';
import SelectPriceLevels from './SelectPriceLevels';
import SelectPlaceType from './SelectPlaceType';
import SelectFoodType from './SelectFoodType';
// import PropTypes from 'prop-types';

function PlaceFilter() {
  // const { filterState, handleFilterChange } = props;
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [selectedCuisine, setSelectedCuisine] = useState([]);
  const [selectedPriceLevel, setSelectedPriceLevel] = useState([]);
  const [selectedFoodTypes, setSelectedFoodTypes] = useState([]);

  const handlePlaceTypeChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedPlaces((places) => [...places, value]);
    } else {
      setSelectedPlaces((places) => [...places, value]);
    }
    // setSelectedCuisine(event.target.value);
  };

  const handleCuisineChange = (event) => {
    setSelectedCuisine((cuisines) => [...cuisines, event.target.value]);
    // setSelectedCuisine(event.target.value);
  };

  const handlePriceLevelChange = (event) => {
    setSelectedPriceLevel((priceLevels) => [...priceLevels, event.target.value]);
    // setSelectedPriceLevel(event.target.value);
  };

  const handleFoodTypeChange = (event) => {
    setSelectedFoodTypes((foodTypes) => [...foodTypes, event.target.value]);
    // setSelectedPriceLevel(event.target.value);
  };

  return (
    <Box
      sx={{
        mt: 2,
        marginLeft: 1,
        marginRight: 5,
        marginBottom: 5,
        minWidth: 250
      }}>
      <SelectPlaceType
        selectedPlaces={selectedPlaces}
        handlePlaceTypeChange={handlePlaceTypeChange}
      />
      <SelectCuisines selectedCuisine={selectedCuisine} handleCuisineChange={handleCuisineChange} />
      <SelectPriceLevels
        selectedPriceLevel={selectedPriceLevel}
        handlePriceLevelChange={handlePriceLevelChange}
      />
      <SelectFoodType
        selectedFoodTypes={selectedFoodTypes}
        handleFoodTypeChange={handleFoodTypeChange}
      />
    </Box>
  );
}

PlaceFilter.propTypes = {};

export default PlaceFilter;
