import React from 'react';
import { Typography, Button, Stack } from '@mui/material';

function SelectedMenuItem(props) {
  const { idx, value, handleRemove, itemType } = props;

  const handleRemoveItem = () => {
    handleRemove(value);
  };

  return (
    <Stack direction="row" spacing={2}>
      <Typography key={idx} value={value}>
        {value !== 'None' ? value : `All ${itemType}`}
      </Typography>
      <Button onClick={handleRemoveItem}>X</Button>
    </Stack>
  );
}

export default SelectedMenuItem;
