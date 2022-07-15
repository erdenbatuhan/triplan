import React from 'react';
import { Box, FormControl, Select, MenuItem, Typography, InputLabel } from '@mui/material';
import SelectedMenuItem from './SelectedMenuItem';
import * as constants from '../../shared/constants';

function SelectCuisines(props) {
  const { selectedItems, handleChange, handleRemove, allOptionIsSelected } = props;
  return (
    <Box sx={{ p: 2, borderColor: 'black', border: 2, borderTop: 0 }}>
      <Typography align="left">Cuisine(s)</Typography>
      <FormControl align="left" sx={{ minWidth: 120 }} size="small" fullWidth>
        <InputLabel sx={{ marginTop: 2 }} id="demo-simple-select-label">
          Select Cuisine(s)
        </InputLabel>
        <Select
          sx={{ marginTop: 2 }}
          labelId="demo-select-small"
          id="demo-select-small"
          value={selectedItems[-1]}
          label="Select Cuisine(s)"
          defaultValue=""
          disabled={allOptionIsSelected}
          onChange={handleChange}>
          <MenuItem value="None">
            <em>All Cuisines</em>
          </MenuItem>
          {constants.cuisines.map((cuisine, idx) => {
            return (
              // eslint-disable-next-line react/no-array-index-key
              <MenuItem key={idx} value={cuisine}>
                {cuisine}
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
        <Typography align="left">Selected Cuisine(s)</Typography>
        <br />
        {selectedItems.map((cuisine, idx) => {
          return (
            <SelectedMenuItem
              // eslint-disable-next-line react/no-array-index-key
              key={idx}
              value={cuisine}
              handleRemove={handleRemove}
              itemType="Cuisines"
            />
          );
        })}
      </Box>
    </Box>
  );
}

export default SelectCuisines;
