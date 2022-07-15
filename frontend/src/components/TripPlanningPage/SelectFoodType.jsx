import React from 'react';
import { Box, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import * as constants from '../../shared/constants';

function SelectFoodType() {
  return (
    <Box sx={{ p: 2, borderColor: 'black', border: 2, borderTop: 0 }}>
      <FormGroup>
        {constants.foodTypes.map((foodType, idx) => {
          // eslint-disable-next-line react/no-array-index-key
          return <FormControlLabel key={idx} control={<Checkbox />} label={foodType} />;
        })}
      </FormGroup>
    </Box>
  );
}

export default SelectFoodType;
