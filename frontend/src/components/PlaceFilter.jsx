import React, { useState } from 'react';
import {
  Box,
  FormGroup,
  FormControl,
  // InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Typography
} from '@mui/material';
import * as constants from '../shared/constants';
// import PropTypes from 'prop-types';

function PlaceFilter() {
  // const { filterState, handleFilterChange } = props;
  const [selectedCuisine, setSelectedCuisine] = useState(['']);
  const [selectedPriceLevel, setSelectedPriceLevel] = useState(['']);

  const handleCuisineChange = (event) => {
    setSelectedCuisine((cuisines) => [...cuisines, event.target.value]);
  };

  const handlePriceLevelChange = (event) => {
    setSelectedPriceLevel((priceLevels) => [...priceLevels, event.target.value]);
  };

  return (
    <Box
      sx={{
        mt: 2,
        marginLeft: 1,
        marginRight: 5,
        marginBottom: 5,
        minWidth: 250
      }}>
      <Box sx={{ p: 2, borderColor: 'black', border: 2 }}>
        <Typography align="left">Type of Place(s)</Typography>
        <FormGroup>
          <FormControlLabel control={<Checkbox />} label="Museum" />
          <FormControlLabel control={<Checkbox />} label="Natural Park" />
          <FormControlLabel control={<Checkbox />} label="Art Gallery" />
          <FormControlLabel control={<Checkbox />} label="Landmarks" />
        </FormGroup>
      </Box>
      <Box sx={{ p: 2, borderColor: 'black', border: 2, borderTop: 0 }}>
        <Typography align="left">Cuisine</Typography>
        <FormControl align="left" sx={{ minWidth: 120 }} size="small">
          <Select
            labelId="demo-select-small"
            id="demo-select-small"
            value={selectedCuisine}
            // label=""
            onChange={handleCuisineChange}>
            <MenuItem value="">
              <em>Select Cuisine(s)</em>
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
      </Box>
      <Box sx={{ p: 2, borderColor: 'black', border: 2, borderTop: 0 }}>
        <Typography align="left">Price Level</Typography>
        <FormControl align="left" sx={{ minWidth: 120 }} size="small">
          <Select
            labelId="demo-select-small"
            id="demo-select-small"
            value={selectedPriceLevel}
            // label=""
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
      </Box>
      <Box sx={{ p: 2, borderColor: 'black', border: 2, borderTop: 0 }}>
        <FormGroup>
          {constants.foodTypes.map((foodType, idx) => {
            // eslint-disable-next-line react/no-array-index-key
            return <FormControlLabel key={idx} control={<Checkbox />} label={foodType} />;
          })}
        </FormGroup>
      </Box>
    </Box>
  );
}

PlaceFilter.propTypes = {};

export default PlaceFilter;
