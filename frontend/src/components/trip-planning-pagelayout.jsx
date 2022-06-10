import * as React from 'react';
import Grid from '@mui/material/Grid';
import BasicList from './list';

export default function TripPlanningLayout() {
  return (
    <Grid container spacing={1}>
      <Grid item xs={3}>
        Filter Container
      </Grid>
      <Grid item xs={3}>
        <BasicList />
      </Grid>
      <Grid item xs={3}>
        <BasicList />
      </Grid>
      <Grid item xs={3}>
        Added places list Container
      </Grid>
    </Grid>
  );
}
