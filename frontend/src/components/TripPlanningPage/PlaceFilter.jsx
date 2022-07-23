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
  const [selectedPriceLevel, setSelectedPriceLevel] = useState([]);
  const [selectedFoodTypes, setSelectedFoodTypes] = useState([]);

  useEffect(() => {
    if (calledFrom === 'TripPlanningPage') {
      setSelectedPlaces(filterState.filterData.touristAttractionFilter.types[0]);
      setSelectedCuisine(filterState.filterData.restaurantFilter.cuisines);
      setSelectedFoodTypes(filterState.filterData.restaurantFilter.foodTypes);
      setSelectedPriceLevel(filterState.filterData.restaurantFilter.priceLevel);
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
      setSelectedCuisine((cuisines) => [...cuisines, value]);
    } else {
      setSelectedCuisine((cuisines) => {
        return cuisines.filter((cuisine) => cuisine !== value);
      });
    }
  };

  const handlePriceLevelChangeCheckbox = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedPriceLevel((priceLevels) => [...priceLevels, value]);
    } else {
      setSelectedPriceLevel((priceLevels) => {
        return priceLevels.filter((priceLevel) => priceLevel !== value);
      });
    }
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
    let taTypes = [];
    let restCuisines = [];
    let restPriceLevel = [];
    let restFoodTypes = [];

    if (selectedPlaces.includes('all')) {
      // taTypes.push(constants.touristAttractions);
      taTypes = constants.touristAttractions;
    } else {
      selectedPlaces.forEach((place) => taTypes.push(constants.touristAttractionsMapper[place]));
    }
    if (isRestaurantEnabled) {
      restCuisines = selectedCuisine.includes('all') ? constants.cuisines : selectedCuisine;
      restPriceLevel = selectedPriceLevel.includes('all')
        ? constants.priceLevels
        : selectedPriceLevel;
      restFoodTypes = selectedFoodTypes.includes('all') ? constants.foodTypes : selectedFoodTypes;
    }

    const filterData = {
      filterData: {
        restaurantFilter: {
          cuisines: restCuisines,
          priceLevel: restPriceLevel,
          foodTypes: restFoodTypes
        },
        touristAttractionFilter: {
          types: selectedPlaces.includes('all')
            ? [constants.places, constants.touristAttractions]
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
              filteredItemType="cuisines"
            />
            <FilterSelectionMenu
              selectedItems={selectedPriceLevel}
              handleSelectionChange={handlePriceLevelChangeCheckbox}
              filteredItemType="priceLevels"
            />
            <FilterSelectionMenu
              selectedItems={selectedFoodTypes}
              handleSelectionChange={handleFoodTypeChange}
              filteredItemType="foodTypes"
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
