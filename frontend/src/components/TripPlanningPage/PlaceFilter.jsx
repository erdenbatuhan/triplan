import React, { useState } from 'react';
import { Box } from '@mui/material';
import SelectCuisines from './SelectCuisines';
import SelectPriceLevels from './SelectPriceLevels';
import SelectPlaceType from './SelectPlaceType';
import SelectFoodType from './SelectFoodType';
// import PropTypes from 'prop-types';

function PlaceFilter() {
  // const { filterState, handleFilterChange } = props;
  const [selectedCuisine, setSelectedCuisine] = useState([]);
  const [selectedPriceLevel, setSelectedPriceLevel] = useState([]);

  const handleCuisineChange = (event) => {
    setSelectedCuisine((cuisines) => [...cuisines, event.target.value]);
    // setSelectedCuisine(event.target.value);
  };

  const handlePriceLevelChange = (event) => {
    setSelectedPriceLevel((priceLevels) => [...priceLevels, event.target.value]);
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
      <SelectPlaceType />
      <SelectCuisines selectedCuisine={selectedCuisine} handleCuisineChange={handleCuisineChange} />
      <SelectPriceLevels
        selectedPriceLevel={selectedPriceLevel}
        handlePriceLevelChange={handlePriceLevelChange}
      />
      <SelectFoodType />
    </Box>
  );
}

PlaceFilter.propTypes = {};

export default PlaceFilter;
