/* eslint-disable no-underscore-dangle */
/* eslint-disable no-alert */
import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import PlacesList from '../components/PlacesList';
import SelectedPlacesList from '../components/SelectedPlacesList';
import { getPlaceData } from '../queries/place-data-queries';

function TripPlanningPage() {
  const [placeData, setPlaceData] = useState([]);
  const [selectedPlaces, setSelectedPlaces] = useState([]);

  useEffect(() => {
    getPlaceData().then((data) => {
      setPlaceData(data);
    });
  }, []);

  const handleSelectedPlacesChange = (selectedPlacesIds) => {
    setSelectedPlaces(placeData.filter((place) => selectedPlacesIds.includes(place._id)));
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={3}>
        Filter Container
      </Grid>
      <Grid item xs={3}>
        <PlacesList
          placeData={placeData}
          selectedPlaces={setSelectedPlaces}
          onSelectedPlacesChange={handleSelectedPlacesChange}
        />
      </Grid>
      <Grid item xs={3}>
        <PlacesList
          placeData={placeData}
          selectedPlaces={setSelectedPlaces}
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
