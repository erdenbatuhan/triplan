import React from 'react';
import { Button, Grid } from '@mui/material';
import DatePicker from '../components/DatePicker';
import SearchBar from '../components/SearchBar';

function MainPage() {
  return (
    <Grid
      container
      spacing={2}
      justifyContent="center"
      direction="row"
      alignItems="center"
      marginTop="unset">
      <Grid item xs={8}>
        <SearchBar />
      </Grid>
      <Grid item xs={4}>
        <DatePicker />
      </Grid>
      <Grid>
        <Button>Continue</Button>
      </Grid>
    </Grid>
  );
}

export default MainPage;
