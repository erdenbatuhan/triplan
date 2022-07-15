import React from 'react';
import { Box, FormControl, Select, MenuItem, Typography, InputLabel } from '@mui/material';
import SelectedMenuItem from './SelectedMenuItem';
import * as constants from '../../shared/constants';

function SelectPriceLevels(props) {
  const { selectedItems, handleChange, handleRemove, allOptionIsSelected } = props;
  return (
    <Box sx={{ p: 2, borderColor: 'black', border: 2, borderTop: 0 }}>
      <Typography align="left">Price Level(s)</Typography>
      <FormControl align="left" sx={{ minWidth: 120 }} size="small" fullWidth>
        <InputLabel sx={{ marginTop: 2 }} id="demo-simple-select-label">
          Select Price Level(s)
        </InputLabel>
        <Select
          sx={{ marginTop: 2 }}
          labelId="demo-select-small"
          id="demo-select-small"
          value={selectedItems[-1]}
          label="Select Price Level(s)"
          defaultValue=""
          disabled={allOptionIsSelected}
          onChange={handleChange}>
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
        {selectedItems.map((priceLevel, idx) => {
          return (
            <SelectedMenuItem
              // eslint-disable-next-line react/no-array-index-key
              key={idx}
              value={priceLevel}
              handleRemove={handleRemove}
              itemType="Price Levels"
            />
          );
        })}
      </Box>
    </Box>
  );
}

export default SelectPriceLevels;
