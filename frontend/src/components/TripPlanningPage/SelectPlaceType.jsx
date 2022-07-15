import React from 'react';
import { Box, FormGroup, FormControlLabel, Checkbox, Typography } from '@mui/material';
import * as constants from '../../shared/constants';

function SelectPlaceType() {
  return (
    <Box sx={{ p: 2, borderColor: 'black', border: 2 }}>
      <Typography align="left">Type of Place(s)</Typography>
      <FormGroup>
        {constants.places.map((place, idx) => {
          // eslint-disable-next-line react/no-array-index-key
          return <FormControlLabel key={idx} control={<Checkbox />} label={place} />;
        })}
      </FormGroup>
    </Box>
  );
}

export default SelectPlaceType;
