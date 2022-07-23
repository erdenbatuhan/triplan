import React, { useState, useEffect } from 'react';
import { useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Fab from '@mui/material/Fab';
import NavigationIcon from '@mui/icons-material/Navigation';
import { green } from '@mui/material/colors';
import { Button } from '@mui/material';
import Spinner from '../components/Spinner';
import Header from '../components/Header';
import PlacesList from '../components/PlacesList';
import SelectedPlacesList from '../components/SelectedPlacesList';
import PlaceFilter from '../components/TripPlanningPage/PlaceFilter';
import { UserAuthHelper } from '../authentication/user-auth-helper';
import { getFilteredPartnerLocations } from '../queries/partner-location-queries';
import * as partnerLocationDefaultFilter from '../queries/data/partner-location-default-filter.json';
import GoogleMap from '../components/GoogleMap';

const fabStyle = {
  bgcolor: green[500],
  '&:hover': {
    bgcolor: green[600]
  },
  margin: 0,
  top: 'auto',
  right: 20,
  bottom: 20,
  left: 'auto',
  position: 'fixed'
};

export default function TripPlanningPage() {
  const { state } = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [authenticatedUser] = useState(UserAuthHelper.getStoredUser());
  const [selectedCity] = useState(state ? state.selectedCity : null);
  const [filterState, setFilterState] = useState(
    state ? state.filterData : partnerLocationDefaultFilter
  );
  const [loading, setLoading] = useState(false);
  const [partnerLocations, setPartnerLocations] = useState({
    restaurants: [],
    touristAttractions: []
  });
  const [selectedPartnerLocationObject, setSelectedPartnerLocationObject] = useState({});
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
      .finally(() => setLoading(false));
  }, [authenticatedUser, filterState]);

  // Listening to the changes in query and partnerLocations
  useEffect(() => {
    const preselectedRestaurantIds = searchParams.get('preselectedRestaurantIds');
    const preselectedTouristAttractionIds = searchParams.get('preselectedTouristAttractionIds');

    // Preselect partner locations if there are any
    if ((preselectedRestaurantIds || preselectedTouristAttractionIds) && partnerLocations) {
      setSelectedPartnerLocationObject([
        // Preselected restaurants
        ...partnerLocations.restaurants.filter(({ _id }) => preselectedRestaurantIds.includes(_id)),
        // Preselected tourist attractions
        ...partnerLocations.touristAttractions.filter(({ _id }) =>
          preselectedTouristAttractionIds.includes(_id)
        )
      ]);
    }
  }, [searchParams, partnerLocations]);

  const handleSelectedPartnerLocationsChange = (selectedPartnerLocationsChanged) => {
    setSelectedPartnerLocationObject([...selectedPartnerLocationsChanged]); // Create a copy of the new list to force re-rendering
  };

  const handleFilterChange = (newFilterState) => {
    setFilterState(newFilterState);
  };

  if (loading) {
    return <Spinner marginTop="5em" />;
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={3}>
        <Header title="Filters" />

        <PlaceFilter
          filterState={filterState}
          handleFilterChange={handleFilterChange}
          calledFrom="TripPlanningPage"
        />
      </Grid>

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

      <Grid item xs={3}>
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
          onClick={() =>
            navigate('/checkout', {
              state: {
                partnerLocations: Object.values(selectedPartnerLocationObject)
              }
            })
          }>
          {' '}
          Continue{' '}
        </Button>

        <Fab variant="extended" style={fabStyle}>
          <NavigationIcon
            sx={{ mr: 1 }}
            onClick={() =>
              // navigate('/checkout', { state: { partnerLocations: orderedPartnerLocations } })
              navigate('/')
            }
          />
          Continue
        </Fab>
      </Grid>
    </Grid>
  );
}
