import React from 'react';
import { Box, Stack, Typography } from '@mui/material';

function RestaurantCuisineDisplay(props) {
  const { cuisineList } = props;
  return (
    <Stack margin={2} direction="row" spacing={2}>
      <Typography variant="h6" color="text.primary" align="center">
        Cuisines:
      </Typography>
      <Box display="flex" flexDirection="column" justifyContent="center">
        <Typography variant="body3" color="text.secondary" align="center">
          {cuisineList.map((c, idx) => (idx === cuisineList.length - 1 ? `${c}.` : `${c}, `))}
        </Typography>
      </Box>
    </Stack>
  );
}

export default RestaurantCuisineDisplay;
