import React from 'react';
// import { Grid, Box, FormGroup, FormControlLabel, Checkbox, Typography } from '@mui/material';
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

function EditRestaurantCuisineBox({ handleCuisineChange } /* props */) {
  // const { selectedItems, handleChange } = props;
  const [selectedCuisines, setSelectedCuisines] = React.useState([]);

  const handleChange = (event) => {
    const val = event.target.value;
    setSelectedCuisines(val);
    handleCuisineChange(val);
  };

  return (
    <Grid>
      <FormControl sx={{ width: '100%' }}>
        <InputLabel> Cuisines(s)</InputLabel>
        <Select
          fullWidth
          multiple
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

  /* return (
    <Box sx={{ p: 2, borderColor: 'black', border: 1, borderTop: 1 }}>
      <Typography align="left">Select Type of Cuisines(s)</Typography>
      <FormGroup>
        <Grid container spacing={2}>
          {constants.cuisines.map((cuisine, idx) => {
            const checked = selectedItems.includes(cuisine);
            return (
              // eslint-disable-next-line react/no-array-index-key
              <Grid item key={idx} xs={4}>
                <FormControlLabel
                  control={<Checkbox checked={checked} />}
                  value={cuisine}
                  label={cuisine}
                  onChange={handleChange}
                />
              </Grid>
            );
          })}
        </Grid>
      </FormGroup>
    </Box>
  ); */
}

export default EditRestaurantCuisineBox;
