import React, { useState, useEffect } from 'react';
import { useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import NavigationIcon from '@mui/icons-material/Navigation';
import { green } from '@mui/material/colors';
import { Button, FormControlLabel, Switch } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Spinner from '../components/common/Spinner';
import Header from '../components/common/Header';
import FilterDropdown from '../components/common/FilterDropdown';
import PlacesList from '../components/PlacesList';
import SelectedPlacesList from '../components/SelectedPlacesList';
import { UserAuthHelper } from '../authentication/user-auth-helper';
import { getFilteredPartnerLocations } from '../queries/partner-location-queries';
import { createTripPlan } from '../queries/trip-plan-queries';
import GoogleMap from '../components/GoogleMap';
import * as constants from '../shared/constants';

export default function TripPlanningPage() {
  const { state } = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  if (!state) {
    navigate(-1);
    return <div />;
  }

  const [authenticatedUser] = useState(UserAuthHelper.getStoredUser());
  const [selectedCity] = useState(state.filterData.selectedCity);
  const [filterState, setFilterState] = useState(state.filterData);
  const [isRestaurantEnabled, setIsRestaurantEnabled] = useState(state.isRestaurantEnabled);

  const [loading, setLoading] = useState(false);
  const [tripPlanCreationInProgress, setTripPlanCreationInProgress] = useState(false);
  const [partnerLocations, setPartnerLocations] = useState({
    restaurants: [],
    touristAttractions: []
  });
  const [selectedPartnerLocationObject, setSelectedPartnerLocationObject] = useState({});
  const [numRestaurantsSelected, setNumRestaurantsSelected] = useState(0);
  const [numTouristAttractionsSelected, setNumTouristAttractionsSelected] = useState(0);
  const [tripPlanName, setTripPlanName] = useState('');
  const [tripPlanNamePlaceholder, setTripPlanNamePlaceholder] = useState('');
  const [windowDimenion, detectHW] = useState({
    winWidth: window.innerWidth,
    winHeight: window.innerHeight
  });

  const detectSize = () => {
    detectHW({
      winWidth: window.innerWidth,
      winHeight: window.innerHeight
    });
  };

  useEffect(() => {
    window.addEventListener('resize', detectSize);

    return () => {
      window.removeEventListener('resize', detectSize);
    };
  }, [windowDimenion]);

  // Listenining to the changes in authenticatedUser and filterState
  useEffect(() => {
    if (!authenticatedUser) {
      return;
    }

    setLoading(true);
    getFilteredPartnerLocations(authenticatedUser.user.id, filterState)
      .then((data) => setPartnerLocations(data))
      .catch(() => alert('An error occurred!'))
      .finally(() => setLoading(false));
  }, [authenticatedUser, filterState]);

  // Listening to the changes in query and partnerLocations
  useEffect(() => {
    const preselectedRestaurantIds = searchParams.get('preselectedRestaurantIds');
    const preselectedTouristAttractionIds = searchParams.get('preselectedTouristAttractionIds');

    // Preselect partner locations if there are any
    if ((preselectedRestaurantIds || preselectedTouristAttractionIds) && partnerLocations) {
      const preselectedRestaurants = partnerLocations.restaurants.filter(({ _id }) =>
        preselectedRestaurantIds.includes(_id)
      );
      const preselectedTouristAttractions = partnerLocations.touristAttractions.filter(({ _id }) =>
        preselectedTouristAttractionIds.includes(_id)
      );

      setSelectedPartnerLocationObject(
        Object.assign(
          {},
          ...[...preselectedRestaurants, ...preselectedTouristAttractions].map(
            (partnerLocation) => ({ [partnerLocation._id]: partnerLocation })
          )
        )
      );

      // Also update the number of places selected
      setNumRestaurantsSelected(preselectedRestaurants.length);
      setNumTouristAttractionsSelected(preselectedTouristAttractions.length);
    }
  }, [searchParams, partnerLocations]);

  // Listening to the changes in numRestaurantsSelected and numTouristAttractionsSelected
  useEffect(() => {
    // Set a placeholder name for the trip plan
    const cityText = `Awesome ${selectedCity} Trip with`;
    const restaurantText = numRestaurantsSelected
      ? ` ${numRestaurantsSelected} Restaurants and`
      : ``;
    const touristAttractionText = numTouristAttractionsSelected
      ? ` ${numTouristAttractionsSelected} Tourist Attractions and`
      : ``;

    setTripPlanNamePlaceholder(`${cityText}${restaurantText}${touristAttractionText}!`);
  }, [numRestaurantsSelected, numTouristAttractionsSelected]);

  const handleSelectedPartnerLocationsChange = (selectedPartnerLocationsChanged) => {
    setSelectedPartnerLocationObject({ ...selectedPartnerLocationsChanged }); // Create a copy to force re-rendering

    // Also update the number of places selected
    setNumRestaurantsSelected(
      Object.values(selectedPartnerLocationsChanged).filter(
        ({ partnerType }) => partnerType === constants.PARTNER_TYPE_RESTAURANT
      ).length
    );
    setNumTouristAttractionsSelected(
      Object.values(selectedPartnerLocationsChanged).filter(
        ({ partnerType }) => partnerType === constants.PARTNER_TYPE_TOURIST_ATTRACTION
      ).length
    );
  };

  const proceedWithTripPlanCreation = () => {
    console.log(filterState);
    setLoading(true);

    createTripPlan(
      authenticatedUser.user.id,
      tripPlanName,
      Object.values(selectedPartnerLocationObject)
    )
      .then(({ _id }) => {
        navigate(`/trip-plan/${_id}/checkout`);
      })
      .finally(() => {
        setLoading(false);
        setTripPlanCreationInProgress(false);
      });
  };

  const applyFilter = () => {
    const filterStateApplied = { ...filterState };

    if (!isRestaurantEnabled) {
      filterStateApplied.filterData.restaurantFilter =
        constants.EMPTY_FILTER.filterData.restaurantFilter;
    }

    // Check for unchanged filter
    if (JSON.stringify(constants.EMPTY_FILTER) === JSON.stringify(filterStateApplied)) {
      alert('Please select at least one option from the filter');
      return;
    }

    setLoading(true);
    getFilteredPartnerLocations(authenticatedUser.user.id, filterStateApplied)
      .then((data) => setPartnerLocations(data))
      .finally(() => setLoading(false));
  };

  const handleCuisinesChange = (updatedCuisines) => {
    filterState.filterData.restaurantFilter.cuisines = updatedCuisines;
    setFilterState(filterState);
  };

  const handleFoodTypesChange = (updatedFoodTypes) => {
    filterState.filterData.restaurantFilter.foodTypes = updatedFoodTypes;
    setFilterState(filterState);
  };

  const handlePriceLevelsChange = (updatedPriceLevels) => {
    filterState.filterData.restaurantFilter.priceLevels = updatedPriceLevels;
    setFilterState(filterState);
  };

  const handleTouristAttractionTypesChange = (updatedTouristAttractionTypes) => {
    filterState.filterData.touristAttractionFilter.types = updatedTouristAttractionTypes;
    setFilterState(filterState);
  };

  if (loading) {
    return <Spinner marginTop="5em" />;
  }

  return (
    <div style={{ backgroundColor: constants.BG_COLOR }}>
      <Grid container spacing={2} alignItems="stretch">
        <Grid item xs={1} />

        <Grid item xs={2}>
          <Header title="Filters" />

          <Box textAlign="center">
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
          </Box>

          <Box>
            <FilterDropdown
              label="Types of Places"
              options={constants.TOURIST_ATTRACTION_TYPE_MAP}
              nameKey="name"
              valueKey="value"
              selections={filterState.filterData.touristAttractionFilter.types}
              onSelectionChange={handleTouristAttractionTypesChange}
            />
          </Box>

          <Box>
            <FilterDropdown
              label="Cuisines"
              options={constants.CUISINES}
              selections={filterState.filterData.restaurantFilter.cuisines}
              onSelectionChange={handleCuisinesChange}
              disabled={!isRestaurantEnabled}
            />
          </Box>

          <Box>
            <FilterDropdown
              label="Price Levels"
              options={constants.PRICE_LEVELS}
              selections={filterState.filterData.restaurantFilter.priceLevels}
              onSelectionChange={handlePriceLevelsChange}
              disabled={!isRestaurantEnabled}
            />
          </Box>

          <Box>
            <FilterDropdown
              label="Diet Options"
              options={constants.FOOD_TYPES}
              selections={filterState.filterData.restaurantFilter.foodTypes}
              onSelectionChange={handleFoodTypesChange}
              disabled={!isRestaurantEnabled}
            />
          </Box>

          <Box>
            <Button
              sx={{ mt: 2, mb: 2, width: '100%', background: 'white' }}
              fontSize="large"
              variant="outlined"
              onClick={applyFilter}>
              Apply Filter
            </Button>
          </Box>
        </Grid>

        {isRestaurantEnabled ? (
          <Grid item xs={3}>
            <Header title="Restaurants" />

            <Paper style={{ maxHeight: windowDimenion.winHeight * 0.8, overflow: 'auto' }}>
              <PlacesList
                partnerLocations={partnerLocations.restaurants}
                selectedPartnerLocationObject={selectedPartnerLocationObject}
                onSelectedPartnerLocationsChange={handleSelectedPartnerLocationsChange}
              />
            </Paper>
          </Grid>
        ) : (
          []
        )}

        <Grid item xs={3}>
          <Header title="Tourist Attractions" />

          <Paper style={{ maxHeight: windowDimenion.winHeight * 0.8, overflow: 'auto' }}>
            <PlacesList
              partnerLocations={partnerLocations.touristAttractions}
              selectedPartnerLocationObject={selectedPartnerLocationObject}
              onSelectedPartnerLocationsChange={handleSelectedPartnerLocationsChange}
            />
          </Paper>
        </Grid>

        <Grid item xs={2}>
          <Header title="Selected Places" />

          <GoogleMap
            selectedCity={selectedCity}
            selectedPartnerLocations={Object.values(selectedPartnerLocationObject)}
          />

          <Paper style={{ maxHeight: windowDimenion.winHeight * 0.8, overflow: 'auto' }}>
            <SelectedPlacesList
              selectedPartnerLocations={Object.values(selectedPartnerLocationObject)}
            />
          </Paper>

          <Button
            variant="extended"
            sx={{
              bgcolor: '#15A4FF',
              '&:hover': {
                bgcolor: green[600]
              },
              margin: 0,
              top: 'auto',
              right: 20,
              bottom: 20,
              left: 'auto',
              position: 'fixed',
              border: '3px',
              borderStyle: 'solid',
              borderRadius: '10px'
            }}
            onClick={() => setTripPlanCreationInProgress(true)}>
            <NavigationIcon sx={{ mr: 1 }} />
            Create My Triplan!
          </Button>
        </Grid>

        <Grid item xs={1} />
      </Grid>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={tripPlanCreationInProgress}
        onClose={() => setTripPlanCreationInProgress(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}>
        <Fade in={tripPlanCreationInProgress}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              border: '2px solid #000',
              boxShadow: 24,
              p: 4
            }}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              What would you like to call this trip?
            </Typography>

            <TextField
              sx={{ mt: 2 }}
              label="Plan Name"
              placeholder={tripPlanNamePlaceholder}
              rows={4}
              fullWidth
              value={tripPlanName}
              onChange={(event) => setTripPlanName(event.target.value)}
            />

            <Button
              disabled={!tripPlanName}
              variant="extended"
              sx={{
                mt: 2,
                bgcolor: '#15A4FF',
                '&:hover': {
                  bgcolor: green[600]
                },
                border: '3px',
                borderStyle: 'solid',
                borderRadius: '10px'
              }}
              onClick={proceedWithTripPlanCreation}>
              Proceed
            </Button>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
