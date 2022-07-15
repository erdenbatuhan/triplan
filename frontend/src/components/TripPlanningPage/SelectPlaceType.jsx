/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Box, FormGroup, FormControlLabel, Checkbox, Typography } from '@mui/material';
import * as constants from '../../shared/constants';

function SelectPlaceType(props) {
  const { selectedPlaces, handlePlaceTypeChange } = props;
  return (
    <Box sx={{ p: 2, borderColor: 'black', border: 2 }}>
      <Typography align="left">Type of Place(s)</Typography>
      <FormGroup>
        {constants.places.map((place, idx) => {
          const checked = selectedPlaces.includes(place);
          return (
            <FormControlLabel
              key={idx}
              control={<Checkbox checked={checked} />}
              value={place}
              label={place}
              onChange={handlePlaceTypeChange}
            />
          );
        })}
      </FormGroup>
    </Box>
  );
}

export default SelectPlaceType;
