/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Box, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import * as constants from '../../shared/constants';

function SelectFoodType(props) {
  const { selectedFoodTypes, handleFoodTypeChange } = props;

  return (
    <Box sx={{ p: 2, borderColor: 'black', border: 1, borderTop: 1 }}>
      <FormGroup>
        {constants.foodTypes.map((foodType, idx) => {
          const checked = selectedFoodTypes.includes(foodType);
          return (
            <FormControlLabel
              key={idx}
              control={<Checkbox checked={checked} />}
              value={foodType}
              label={foodType}
              onChange={handleFoodTypeChange}
            />
          );
        })}
      </FormGroup>
    </Box>
  );
}

export default SelectFoodType;
