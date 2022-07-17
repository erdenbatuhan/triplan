import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Fab from '@mui/material/Fab';
import NavigationIcon from '@mui/icons-material/Navigation';
import { green } from '@mui/material/colors';
import Spinner from '../components/Spinner';
import PlacesList from '../components/PlacesList';
import SelectedPlacesList from '../components/SelectedPlacesList';
import PlaceFilter from '../components/TripPlanningPage/PlaceFilter';
import { getFilteredPartnerLocations } from '../queries/partner-location-queries';

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
  const { filterData } = state;

  const [filterState, setFilterState] = useState(filterData);
  const [loading, setLoading] = useState(true);
  const [partnerLocations, setPartnerLocations] = useState({
    restaurants: [],
    touristAttractions: []
  });
  const [selectedPartnerLocations, setSelectedPartnerLocations] = useState([]);
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

  // Triggered each time the filter prop is changed
  useEffect(() => {
    getFilteredPartnerLocations(filterState)
      .then((data) => setPartnerLocations(data))
      .finally(() => setLoading(false));
  }, [filterState]);

  const handleSelectedPartnerLocationsChange = (selectedPartnerLocationsChanged) => {
    setSelectedPartnerLocations([...selectedPartnerLocationsChanged]); // Create a copy of the new list to force re-rendering
  };

  const handleFilterChange = (newFilterState) => {
    setFilterState(newFilterState);
  };

  if (loading) {
    return <Spinner marginTop="5em" />;
  }

  const getHeader = (title) => {
    return (
      <div>
        <br /> {title} <hr /> <br />
      </div>
    );
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={3}>
        {getHeader('Filters')}
        <PlaceFilter
          filterState={filterState}
          handleFilterChange={handleFilterChange}
          calledFrom="TripPlanningPage"
        />
      </Grid>
      <Grid item xs={3}>
        {getHeader('Restaurants')}
        <Paper style={{ maxHeight: windowDimenion.winHeight * 0.8, overflow: 'auto' }}>
          <PlacesList
            places={partnerLocations.restaurants}
            selectedPlaces={selectedPartnerLocations}
            onSelectedPlacesChange={handleSelectedPartnerLocationsChange}
          />
        </Paper>
      </Grid>
      <Grid item xs={3}>
        {getHeader('Tourist Attractions')}
        <Paper style={{ maxHeight: windowDimenion.winHeight * 0.8, overflow: 'auto' }}>
          <PlacesList
            places={partnerLocations.touristAttractions}
            selectedPlaces={selectedPartnerLocations}
            onSelectedPlacesChange={handleSelectedPartnerLocationsChange}
          />
        </Paper>
      </Grid>
      <Grid item xs={3}>
        {getHeader('Selected Places')}
        <Paper style={{ maxHeight: windowDimenion.winHeight * 0.8, overflow: 'auto' }}>
          <SelectedPlacesList selectedPlaces={selectedPartnerLocations} />
        </Paper>
        <Fab variant="extended" style={fabStyle}>
          <NavigationIcon sx={{ mr: 1 }} />
          Continue
        </Fab>
      </Grid>
    </Grid>
  );
}
