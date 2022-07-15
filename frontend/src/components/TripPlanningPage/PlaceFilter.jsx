/* eslint-disable react/jsx-no-useless-fragment */
import React, { useState } from 'react';
import { Box, Button, Stack } from '@mui/material';
import SelectCuisines from './SelectCuisines';
import SelectPriceLevels from './SelectPriceLevels';
import SelectPlaceType from './SelectPlaceType';
import SelectFoodType from './SelectFoodType';
// import PropTypes from 'prop-types';

function PlaceFilter(props) {
  const { handleContinueClick, handleFilterChange, calledFrom } = props; // filterState,
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [selectedCuisine, setSelectedCuisine] = useState([]);
  const [selectedPriceLevel, setSelectedPriceLevel] = useState([]);
  const [selectedFoodTypes, setSelectedFoodTypes] = useState([]);
  const [allCuisinesSelected, setAllCuisinesSelected] = useState(false);
  const [allPriceLevelsSelected, setAllPriceLevelsSelected] = useState(false);

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
    if (event.target.value === 'None') {
      setAllCuisinesSelected(true);
      setSelectedCuisine([event.target.value]);
    } else {
      setSelectedCuisine((cuisines) => [...cuisines, event.target.value]);
    }
  };

  const handleCuisineSelectionRemove = (removedCuisine) => {
    if (removedCuisine === 'None') {
      setAllCuisinesSelected(false);
    }
    setSelectedCuisine((cuisines) => {
      return cuisines.filter((cuisine) => cuisine !== removedCuisine);
    });
  };

  const handlePriceLevelChange = (event) => {
    if (event.target.value === 'None') {
      setAllPriceLevelsSelected(true);
      setSelectedPriceLevel([event.target.value]);
    } else {
      setSelectedPriceLevel((priceLevels) => [...priceLevels, event.target.value]);
    }
  };

  const handlePriceLevelRemove = (removedPriceLevel) => {
    if (removedPriceLevel === 'None') {
      setAllPriceLevelsSelected(false);
    }
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
    const filterData = {
      filterData: {
        restaurantFilter: {
          cuisines: selectedCuisine,
          priceLevel: selectedPriceLevel,
          foodTypes: selectedFoodTypes
        },
        touristAttractionFilter: {
          types: selectedPlaces
        }
      }
    };
    if (calledFrom !== 'MainPage') {
      handleFilterChange(filterData);
    } else {
      handleContinueClick(filterData);
    }
  };

  return (
    <Box>
      <Stack
        direction={calledFrom === 'MainPage' ? 'row' : 'column'}
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
          selectedItems={selectedCuisine}
          handleChange={handleCuisineChange}
          handleRemove={handleCuisineSelectionRemove}
          allOptionIsSelected={allCuisinesSelected}
        />
        <SelectPriceLevels
          selectedItems={selectedPriceLevel}
          handleChange={handlePriceLevelChange}
          handleRemove={handlePriceLevelRemove}
          allOptionIsSelected={allPriceLevelsSelected}
        />
        <SelectFoodType
          selectedFoodTypes={selectedFoodTypes}
          handleFoodTypeChange={handleFoodTypeChange}
        />
        {calledFrom === 'TripPlanningPage' ? (
          <Box sx={{ p: 2, borderColor: 'black', border: 1, borderTop: 1 }}>
            <Button onClick={handleButtonClick}>Filter!</Button>
          </Box>
        ) : (
          <></>
        )}
      </Stack>
      {calledFrom === 'MainPage' ? (
        <Button variant="outlined" onClick={handleButtonClick}>
          Continue
        </Button>
      ) : (
        <></>
      )}
    </Box>
  );
}

PlaceFilter.propTypes = {};

export default PlaceFilter;
