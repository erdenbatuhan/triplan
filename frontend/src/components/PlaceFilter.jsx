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
// import PropTypes from 'prop-types';

function PlaceFilter() {
  const [cuisine, setCuisine] = useState(['']);
  const [priceLevel, setPriceLevel] = useState(['']);

  const handleCuisineChange = (event) => {
    setCuisine((cuisines) => [...cuisines, event.target.value]);
  };

  const handlePriceLevelChange = (event) => {
    setPriceLevel((priceLevels) => [...priceLevels, event.target.value]);
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
            value={cuisine}
            // label=""
            onChange={handleCuisineChange}>
            <MenuItem value="">
              <em>Select Cuisine(s)</em>
            </MenuItem>
            <MenuItem value="Japanese">Japanese</MenuItem>
            <MenuItem value="Chinese">Chinese</MenuItem>
            <MenuItem value="Indian">Indian</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ p: 2, borderColor: 'black', border: 2, borderTop: 0 }}>
        <Typography align="left">Price Level</Typography>
        <FormControl align="left" sx={{ minWidth: 120 }} size="small">
          <Select
            labelId="demo-select-small"
            id="demo-select-small"
            value={priceLevel}
            // label=""
            onChange={handlePriceLevelChange}>
            <MenuItem value="">
              <em>Select Price Level(s)</em>
            </MenuItem>
            <MenuItem value="€">€</MenuItem>
            <MenuItem value="€€">€€</MenuItem>
            <MenuItem value="€€€">€€€</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ p: 2, borderColor: 'black', border: 2, borderTop: 0 }}>
        <FormGroup>
          <FormControlLabel control={<Checkbox />} label="Vegan" />
          <FormControlLabel control={<Checkbox />} label="Vegetarian" />{' '}
        </FormGroup>
      </Box>
    </Box>
  );
}

PlaceFilter.propTypes = {};

export default PlaceFilter;
