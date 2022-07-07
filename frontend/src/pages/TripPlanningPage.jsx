/* eslint-disable no-underscore-dangle */
/* eslint-disable no-alert */
import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Spinner from '../components/Spinner';
import PlacesList from '../components/PlacesList';
import SelectedPlacesList from '../components/SelectedPlacesList';
import { getFilteredPartnerLocations } from '../queries/partner-location-queries';

export default function TripPlanningPage({ filter }) {
  const [loading, setLoading] = useState(true);
  const [partnerLocations, setPartnerLocations] = useState({
    restaurants: [],
    touristAttractions: []
  });
  const [selectedPartnerLocations, setSelectedPartnerLocations] = useState([]);

  // Triggered each time the filter prop is changed
  useEffect(() => {
    getFilteredPartnerLocations(filter)
      .then((data) => setPartnerLocations(data))
      .finally(() => setLoading(false));
  }, [filter]);

  const handleSelectedPartnerLocationsChange = (selectedPartnerLocationsChanged) => {
    setSelectedPartnerLocations([...selectedPartnerLocationsChanged]); // Create a copy of the new list to force re-rendering
  };

  if (loading) {
    return <Spinner />;
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
        {getHeader('Filter Container')}
      </Grid>
      <Grid item xs={3}>
        {getHeader('Restaurants')}
        <PlacesList
          places={partnerLocations.restaurants}
          selectedPlaces={selectedPartnerLocations}
          onSelectedPlacesChange={handleSelectedPartnerLocationsChange}
        />
      </Grid>
      <Grid item xs={3}>
        {getHeader('Tourist Attractions')}
        <PlacesList
          places={partnerLocations.touristAttractions}
          selectedPlaces={selectedPartnerLocations}
          onSelectedPlacesChange={handleSelectedPartnerLocationsChange}
        />
      </Grid>
      <Grid item xs={3}>
        {getHeader('Selected Places')}
        <SelectedPlacesList selectedPlaces={selectedPartnerLocations} />
      </Grid>
    </Grid>
  );
}
