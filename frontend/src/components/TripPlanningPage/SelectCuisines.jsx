import React from 'react';
import { Box, FormControl, Select, MenuItem, Typography } from '@mui/material';
import SelectedMenuItem from './SelectedMenuItem';
import * as constants from '../../shared/constants';

function SelectCuisines(props) {
  const {
    selectedCuisine,
    handleCuisineChange,
    handleCuisineSelectionRemove,
    allCuisinesSelected
  } = props;
  return (
    <Box sx={{ p: 2, borderColor: 'black', border: 2, borderTop: 0 }}>
      <Typography align="left">Cuisine(s)</Typography>
      <FormControl align="left" sx={{ minWidth: 120 }} size="small">
        <Select
          sx={{ marginTop: 2 }}
          labelId="demo-select-small"
          id="demo-select-small"
          value={selectedCuisine[-1]}
          label="Select Cuisine(s)"
          defaultValue=""
          disabled={allCuisinesSelected}
          onChange={handleCuisineChange}>
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
        {selectedCuisine.map((cuisine, idx) => {
          return (
            <SelectedMenuItem
              // eslint-disable-next-line react/no-array-index-key
              key={idx}
              value={cuisine}
              handleRemove={handleCuisineSelectionRemove}
              itemType="Cuisines"
            />
          );
        })}
      </Box>
    </Box>
  );
}

export default SelectCuisines;
