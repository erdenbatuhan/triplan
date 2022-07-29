import React from 'react';
import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import TextField from '@mui/material/TextField';

function DatePicker() {
  const [value, setValue] = React.useState(new Date());

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DesktopDatePicker
        label="Select your trip date"
        inputFormat="dd/MM/yyyy"
        value={value}
        onChange={setValue}
        renderInput={(params) => (
          <TextField sx={{ background: 'white', width: '100%' }} {...params} />
        )}
      />
    </LocalizationProvider>
  );
}

export default DatePicker;
