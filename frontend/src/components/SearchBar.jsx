import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { getCities } from '../queries/partner-location-queries';

function SearchBar() {
  const [cities, setCities] = useState([]);
  const [value, setValue] = useState('');

  useEffect(() => {
    getCities().then((data) => {
      setCities(data);
    });
  }, []);

  const setSelectedValue = (event, val) => {
    setValue(val);
  };

  return (
    <Autocomplete
      freeSolo
      disableClearable
      options={cities.map((city) => city)}
      onChange={setSelectedValue}
      value={value}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Select a destination"
          InputProps={{
            ...params.InputProps,
            type: 'search'
          }}
        />
      )}
    />
  );
}

export default SearchBar;
