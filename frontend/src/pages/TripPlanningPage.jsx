import * as React from 'react';
import Grid from '@mui/material/Grid';
import PlacesList from '../components/PlacesList';

function TripPlanningPage() {
  return (
    <Grid container spacing={1}>
      <Grid item xs={3}>
        Filter Container
      </Grid>
      <Grid item xs={3}>
        <PlacesList />
      </Grid>
      <Grid item xs={3}>
        <PlacesList />
      </Grid>
      <Grid item xs={3}>
        Added places list Container
      </Grid>
    </Grid>
  );
}

export default TripPlanningPage;
