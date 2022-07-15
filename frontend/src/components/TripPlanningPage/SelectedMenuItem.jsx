import React from 'react';
import { Typography, Button, Stack } from '@mui/material';

function SelectedMenuItem(props) {
  const { key, value, handleCuisineSelectionRemove } = props;

  const handleRemoveItem = () => {
    handleCuisineSelectionRemove(value);
  };

  return (
    <Stack direction="row" spacing={2}>
      <Typography key={key} value={value}>
        {value}
      </Typography>
      <Button onClick={handleRemoveItem}>X</Button>
    </Stack>
  );
}

export default SelectedMenuItem;
