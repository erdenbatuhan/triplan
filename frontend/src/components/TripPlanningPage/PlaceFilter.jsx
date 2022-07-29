/* eslint-disable react/jsx-no-useless-fragment */
import React, { useEffect, useState } from 'react';
import { Box, Button, Stack, Switch, FormControlLabel } from '@mui/material';
import * as constants from '../../shared/constants';
import FilterSelectionMenu from './FilterSelectionMenu';
// import PropTypes from 'prop-types';

function PlaceFilter(props) {
  const {
    filterState,
    handleFilterChange,
    handleContinueClick,
    isRestaurantEnabled,
    handleRestaurantEnable,
    calledFrom
  } = props; // filterState,
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [selectedCuisine, setSelectedCuisine] = useState([]);
  const [selectedPriceLevels, setSelectedPriceLevels] = useState([]);
  const [selectedFoodTypes, setSelectedFoodTypes] = useState([]);

  useEffect(() => {
    if (calledFrom === 'TripPlanningPage') {
      setSelectedPlaces(filterState.filterData.touristAttractionFilter.types[0]);
      setSelectedCuisine(filterState.filterData.restaurantFilter.CUISINES);
      setSelectedFoodTypes(filterState.filterData.restaurantFilter.FOOD_TYPES);
      setSelectedPriceLevels(filterState.filterData.restaurantFilter.PRICE_LEVELS);
    }
  }, [filterState]);

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

  const handleCuisineChangeCheckbox = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedCuisine((CUISINES) => [...CUISINES, value]);
    } else {
      setSelectedCuisine((CUISINES) => {
        return CUISINES.filter((cuisine) => cuisine !== value);
      });
    }
  };

  const handlePriceLevelsChangeCheckbox = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedPriceLevels((PRICE_LEVELS) => [...PRICE_LEVELS, value]);
    } else {
      setSelectedPriceLevels((PRICE_LEVELS) => {
        return PRICE_LEVELS.filter((priceLevel) => priceLevel !== value);
      });
    }
  };

  const handleFoodTypeChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedFoodTypes((FOOD_TYPES) => [...FOOD_TYPES, value]);
    } else {
      setSelectedFoodTypes((FOOD_TYPES) => {
        return FOOD_TYPES.filter((foodType) => foodType !== value);
      });
    }
  };

  const handleButtonClick = () => {
    let taTypes = [];
    let restCuisines = [];
    let restPriceLevels = [];
    let restFoodTypes = [];

    if (selectedPlaces.includes('all')) {
      // taTypes.push(constants.touristAttractions);
      taTypes = Object.values(constants.TOURIST_ATTRACTION_TYPE_MAP);
    } else {
      selectedPlaces.forEach((place) => taTypes.push(constants.TOURIST_ATTRACTION_TYPE_MAP[place]));
    }
    if (isRestaurantEnabled) {
      restCuisines = selectedCuisine.includes('all') ? constants.CUISINES : selectedCuisine;
      restPriceLevels = selectedPriceLevels.includes('all')
        ? constants.PRICE_LEVELS
        : selectedPriceLevels;
      restFoodTypes = selectedFoodTypes.includes('all') ? constants.FOOD_TYPES : selectedFoodTypes;
    }

    const filterData = {
      filterData: {
        restaurantFilter: {
          CUISINES: restCuisines,
          PRICE_LEVELS: restPriceLevels,
          FOOD_TYPES: restFoodTypes
        },
        touristAttractionFilter: {
          types: selectedPlaces.includes('all')
            ? [
                constants.TOURIST_ATTRACTION_TYPES,
                Object.values(constants.TOURIST_ATTRACTION_TYPE_MAP)
              ]
            : [selectedPlaces, taTypes]
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
    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <FormControlLabel
        control={
          <Switch onChange={handleRestaurantEnable} checked={isRestaurantEnabled} color="primary" />
        }
        label="Looking for restaurants as well?"
        labelPlacement="top"
      />
      <Stack
        direction={calledFrom === 'MainPage' ? 'row' : 'column'}
        sx={{
          mt: 1,
          marginLeft: 1,
          marginRight: 1,
          marginBottom: 3,
          minWidth: 250
        }}>
        <FilterSelectionMenu
          selectedItems={selectedPlaces}
          handleSelectionChange={handlePlaceTypeChange}
          filteredItemType="places"
        />
        {isRestaurantEnabled ? (
          <>
            <FilterSelectionMenu
              selectedItems={selectedCuisine}
              handleSelectionChange={handleCuisineChangeCheckbox}
              filteredItemType="CUISINES"
            />
            <FilterSelectionMenu
              selectedItems={selectedPriceLevels}
              handleSelectionChange={handlePriceLevelsChangeCheckbox}
              filteredItemType="PRICE_LEVELS"
            />
            <FilterSelectionMenu
              selectedItems={selectedFoodTypes}
              handleSelectionChange={handleFoodTypeChange}
              filteredItemType="FOOD_TYPES"
            />
          </>
        ) : (
          <></>
        )}
        {calledFrom === 'TripPlanningPage' ? (
          <Box sx={{ p: 2, borderColor: 'black', border: 1, borderTop: 1 }}>
            <Button onClick={handleButtonClick}>Filter!</Button>
          </Box>
        ) : (
          <></>
        )}
      </Stack>
      {calledFrom === 'MainPage' ? (
        <Button
          variant="outlined"
          sx={{ width: 100, height: 40, marginRight: 1 }}
          onClick={handleButtonClick}>
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
