import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

function SearchBar({ label, entries, previousSelection, onSelectionChange }) {
  const [selection, setSelection] = useState(previousSelection || '');

  const setSelectedValue = (_, val) => {
    setSelection(val); // Update state
    onSelectionChange(val); // Update parent
  };

  return (
    <Autocomplete
      sx={{ background: 'white' }}
      freeSolo
      disableClearable
      options={entries.map((item) => item)}
      onChange={setSelectedValue}
      value={selection}
      // sx={{ width: '66%' }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
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
