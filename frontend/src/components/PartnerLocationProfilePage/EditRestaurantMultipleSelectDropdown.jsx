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

const MIN_SELECTED_LENGTH_BEFORE_UNWIND = 4;

export default function EditRestaurantMultipleSelectDropdown({
  label,
  itemList,
  selectedItems,
  handleDropdownSelection
}) {
  const handleChange = (event) => {
    const val = event.target.value;

    handleDropdownSelection(val);
  };

  return (
    <Grid>
      <FormControl sx={{ width: '100%' }}>
        <InputLabel>{label}</InputLabel>

        <Select
          fullWidth
          multiple
          selected="selected"
          value={selectedItems}
          onChange={handleChange}
          input={<OutlinedInput label={label} />}
          renderValue={(selected) =>
            selected.length <= MIN_SELECTED_LENGTH_BEFORE_UNWIND
              ? selected.join(', ')
              : `${selected.length} ${label.toLocaleLowerCase()}`
          }>
          {itemList.map((item) => (
            <MenuItem key={item} value={item}>
              <Checkbox checked={selectedItems.indexOf(item) > -1} />
              <ListItemText primary={item} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
  );
}
