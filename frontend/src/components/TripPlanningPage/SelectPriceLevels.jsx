import React from 'react';
import { Box, FormControl, Select, MenuItem, Typography } from '@mui/material';
import SelectedMenuItem from './SelectedMenuItem';
import * as constants from '../../shared/constants';

function SelectPriceLevels(props) {
  const { selectedPriceLevel, handlePriceLevelChange, handlePriceLevelRemove } = props;
  return (
    <Box sx={{ p: 2, borderColor: 'black', border: 2, borderTop: 0 }}>
      <Typography align="left">Price Level(s)</Typography>
      <FormControl align="left" sx={{ minWidth: 120 }} size="small">
        <Select
          labelId="demo-select-small"
          id="demo-select-small"
          value={selectedPriceLevel[-1]}
          // label=""
          defaultValue=""
          onChange={handlePriceLevelChange}>
          <MenuItem value="">
            <em>Select Price Level(s)</em>
          </MenuItem>
          {constants.priceLevels.map((priceLevel, idx) => {
            return (
              // eslint-disable-next-line react/no-array-index-key
              <MenuItem key={idx} value={priceLevel}>
                {priceLevel}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <Box
        sx={{
          mt: 2,
          marginLeft: 1,
          marginRight: 5,
          marginBottom: 5,
          minWidth: 250
        }}>
        <Typography align="left">Selected Price Level(s)</Typography>
        <br />
        {selectedPriceLevel.map((priceLevel, idx) => {
          return (
            <SelectedMenuItem
              // eslint-disable-next-line react/no-array-index-key
              key={idx}
              value={priceLevel}
              handleCuisineSelectionRemove={handlePriceLevelRemove}
            />
          );
        })}
      </Box>
    </Box>
  );
}

export default SelectPriceLevels;
