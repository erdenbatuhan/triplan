import React from 'react';
// import { Box, Card, CardActions, Typography, Grid } from '@mui/material';
import { Box, Grid, FormGroup, FormControlLabel, Checkbox, Typography } from '@mui/material';
// import PropTypes from 'prop-types';

function PlaceFilter() {
  return (
    <Box
      sx={{
        mt: 4,
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 5
      }}>
      <Grid container direction="column" justifyContent="center" alignItems="center">
        <Grid item>
          <Box sx={{ p: 2, borderColor: 'black', border: 2 }}>
            <Typography align="center">Type of Place(s)</Typography>
            <FormGroup>
              <FormControlLabel control={<Checkbox defaultChecked />} label="Museum" />
              <FormControlLabel control={<Checkbox />} label="Natural Park" />
              <FormControlLabel control={<Checkbox />} label="Art Gallery" />
              <FormControlLabel control={<Checkbox />} label="Landmarks" />
            </FormGroup>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

PlaceFilter.propTypes = {};

export default PlaceFilter;
