import React from 'react';
import { Box, FormControl, Select, MenuItem, Typography } from '@mui/material';
import SelectedMenuItem from './SelectedMenuItem';
import * as constants from '../../shared/constants';

function SelectPriceLevels(props) {
  const {
    selectedPriceLevel,
    handlePriceLevelChange,
    handlePriceLevelRemove,
    allPriceLevelsSelected
  } = props;
  return (
    <Box sx={{ p: 2, borderColor: 'black', border: 2, borderTop: 0 }}>
      <Typography align="left">Price Level(s)</Typography>
      <FormControl align="left" sx={{ minWidth: 120 }} size="small">
        <Select
          labelId="demo-select-small"
          id="demo-select-small"
          value={selectedPriceLevel[-1]}
          label="Select Price Level(s)"
          defaultValue=""
          disabled={allPriceLevelsSelected}
          onChange={handlePriceLevelChange}>
          <MenuItem value="None">
            <em>All Levels</em>
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
              handleRemove={handlePriceLevelRemove}
              itemType="Price Levels"
            />
          );
        })}
      </Box>
    </Box>
  );
}

export default SelectPriceLevels;
