import React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

export default function Spinner({ marginTop }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: { marginTop }
      }}>
      <CircularProgress color="secondary" />
    </Box>
  );
}
