import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
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
      setSelectedPlaces((places) => {
        return places.filter((place) => place !== value);
      });
    }
  };

  const handleCuisineChange = (event) => {
    setSelectedCuisine((cuisines) => [...cuisines, event.target.value]);
  };

  const handleCuisineSelectionRemove = (removedCuisine) => {
    setSelectedCuisine((cuisines) => {
      return cuisines.filter((cuisine) => cuisine !== removedCuisine);
    });
  };

  const handlePriceLevelChange = (event) => {
    setSelectedPriceLevel((priceLevels) => [...priceLevels, event.target.value]);
  };

  const handlePriceLevelRemove = (removedPriceLevel) => {
    setSelectedPriceLevel((priceLevels) => {
      return priceLevels.filter((priceLevel) => priceLevel !== removedPriceLevel);
    });
  };

  const handleFoodTypeChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedFoodTypes((foodTypes) => [...foodTypes, value]);
    } else {
      setSelectedFoodTypes((foodTypes) => {
        return foodTypes.filter((foodType) => foodType !== value);
      });
    }
  };

  const handleButtonClick = () => {
    console.log('lol');
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
      <SelectCuisines
        selectedCuisine={selectedCuisine}
        handleCuisineChange={handleCuisineChange}
        handleCuisineSelectionRemove={handleCuisineSelectionRemove}
      />
      <SelectPriceLevels
        selectedPriceLevel={selectedPriceLevel}
        handlePriceLevelChange={handlePriceLevelChange}
        handlePriceLevelRemove={handlePriceLevelRemove}
      />
      <SelectFoodType
        selectedFoodTypes={selectedFoodTypes}
        handleFoodTypeChange={handleFoodTypeChange}
      />
      <Box sx={{ p: 2, borderColor: 'black', border: 2, borderTop: 0 }}>
        <Button onClick={handleButtonClick}>Filter!</Button>
      </Box>
    </Box>
  );
}

PlaceFilter.propTypes = {};

export default PlaceFilter;
