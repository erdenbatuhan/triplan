/* eslint-disable no-underscore-dangle */
/* eslint-disable no-alert */
import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import PlacesList from '../components/PlacesList';
import SelectedPlacesList from '../components/SelectedPlacesList';
import { getPlaceData } from '../queries/place-data-queries';

function TripPlanningPage() {
  const [loading, setLoading] = useState(true);
  const [placeData, setPlaceData] = useState([]);
  const [selectedPlaces, setSelectedPlaces] = useState([]);

  useEffect(() => {
    getPlaceData()
      .then((data) => setPlaceData(data))
      .finally(() => setLoading(false));
  }, []);

  const handleSelectedPlacesChange = (selectedPlacedChanged) => {
    setSelectedPlaces([...selectedPlacedChanged]); // Create a copy of the new list to force re-rendering
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={3}>
        Filter Container
      </Grid>
      <Grid item xs={3}>
        <PlacesList
          placeData={placeData}
          selectedPlaces={selectedPlaces}
          onSelectedPlacesChange={handleSelectedPlacesChange}
        />
      </Grid>
      <Grid item xs={3}>
        <PlacesList
          placeData={placeData}
          selectedPlaces={selectedPlaces}
          onSelectedPlacesChange={handleSelectedPlacesChange}
        />
      </Grid>
      <Grid item xs={3}>
        <SelectedPlacesList selectedPlaces={selectedPlaces} />
      </Grid>
    </Grid>
  );
}

export default TripPlanningPage;
