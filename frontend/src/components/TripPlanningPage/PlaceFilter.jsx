/* eslint-disable react/jsx-no-useless-fragment */
import React, { useEffect, useState } from 'react';
import { Box, Button, Stack } from '@mui/material';
import * as constants from '../../shared/constants';
import FilterSelectionMenu from './FilterSelectionMenu';
// import PropTypes from 'prop-types';

function PlaceFilter(props) {
  const { filterState, handleContinueClick, handleFilterChange, calledFrom } = props; // filterState,
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
    const taTypes = [];
    if (selectedPlaces.includes('all')) {
      taTypes.push(constants.touristAttractions);
    } else {
      selectedPlaces.forEach((place) => taTypes.push(constants.touristAttractionsMapper[place]));
    }
    const filterData = {
      filterData: {
        restaurantFilter: {
          cuisines: selectedCuisine.includes('all') ? constants.cuisines : selectedCuisine,
          priceLevel: selectedPriceLevel.includes('all')
            ? constants.priceLevels
            : selectedPriceLevel,
          foodTypes: selectedFoodTypes.includes('all') ? constants.foodTypes : selectedFoodTypes
        },
        touristAttractionFilter: {
          types: selectedFoodTypes.includes('all')
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
        <FilterSelectionMenu
          selectedItems={selectedPlaces}
          handleSelectionChange={handlePlaceTypeChange}
          filteredItemType="places"
        />
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
