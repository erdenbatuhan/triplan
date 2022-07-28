import React from 'react';
import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput
} from '@mui/material';
import * as constants from '../../shared/constants';

function EditRestaurantCuisineBox({ selectedCuisines, handleCuisineChange }) {
  const handleChange = (event) => {
    const val = event.target.value;

    handleCuisineChange(val);
  };

  return (
    <Grid>
      <FormControl sx={{ width: '100%' }}>
        <InputLabel> Cuisines(s)</InputLabel>
        <Select
          fullWidth
          multiple
          selected="selected"
          value={selectedCuisines}
          onChange={handleChange}
          input={<OutlinedInput label="Cuisines(s)" />}
          renderValue={(selected) => selected.join(', ')}>
          {constants.cuisines.map((cuisine) => (
            <MenuItem key={cuisine} value={cuisine}>
              <Checkbox checked={selectedCuisines.indexOf(cuisine) > -1} />
              <ListItemText primary={cuisine} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
  );
}

export default EditRestaurantCuisineBox;
