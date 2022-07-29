/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Box, FormGroup, FormControlLabel, Checkbox, Typography } from '@mui/material';
import * as constants from '../../shared/constants';

const menuNames = {
  places: 'Place',
  CUISINES: 'Cuisine',
  PRICE_LEVELS: 'Price Level',
  FOOD_TYPES: 'Diet'
};

function FilterSelectionMenu(props) {
  const { selectedItems, handleSelectionChange, filteredItemType } = props;
  return (
    <Box
      sx={{
        p: 2,
        borderColor: 'black',
        border: 1,
        borderTop: 1,
        maxHeight: 300,
        overflow: 'auto'
      }}>
      <Typography
        variant="h6"
        color="text.primary"
        align="center"
        sx={{ textDecoration: 'underline' }}
        display="inline">
        {menuNames[filteredItemType]} Options
      </Typography>
      <FormGroup>
        <FormControlLabel
          control={<Checkbox checked={selectedItems.includes('all')} />}
          value="all"
          label="Select All Options"
          onChange={handleSelectionChange}
        />
        {constants[`${filteredItemType}`].map((item, idx) => {
          const checked = selectedItems.includes(item) || selectedItems.includes('all');
          return (
            <FormControlLabel
              key={idx}
              control={<Checkbox checked={checked} />}
              disabled={selectedItems.includes('all')}
              value={item}
              label={item}
              onChange={handleSelectionChange}
            />
          );
        })}
      </FormGroup>
    </Box>
  );
}

export default FilterSelectionMenu;
