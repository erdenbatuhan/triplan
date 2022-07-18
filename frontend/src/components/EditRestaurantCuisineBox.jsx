import React from 'react';
import { Grid, Box, FormGroup, FormControlLabel, Checkbox, Typography } from '@mui/material';
import * as constants from '../shared/constants';

function EditRestaurantCuisineBox(props) {
  const { selectedItems, handleChange } = props;
  return (
    <Box sx={{ p: 2, borderColor: 'black', border: 1, borderTop: 1 }}>
      <Typography align="left">Select Type of Cuisines(s)</Typography>
      <FormGroup>
        <Grid container spacing={2}>
          {constants.cuisines.map((cuisine, idx) => {
            const checked = selectedItems.includes(cuisine);
            return (
              // eslint-disable-next-line react/no-array-index-key
              <Grid item key={idx} xs={4}>
                <FormControlLabel
                  control={<Checkbox checked={checked} />}
                  value={cuisine}
                  label={cuisine}
                  onChange={handleChange}
                />
              </Grid>
            );
          })}
        </Grid>
      </FormGroup>
    </Box>
  );
}

export default EditRestaurantCuisineBox;
