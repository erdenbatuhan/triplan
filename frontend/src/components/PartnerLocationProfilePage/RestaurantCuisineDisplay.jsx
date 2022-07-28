import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import MenuBookIcon from '@mui/icons-material/MenuBook';

export default function RestaurantCuisineDisplay({ displayList, isCuisine }) {
  return (
    <Box display="flex" flexDirection="column" justifyContent="center">
      {displayList.length > 0 ? (
        <IconButton pointerEvents="none">
          {isCuisine ? <RestaurantIcon /> : <MenuBookIcon />}
        </IconButton>
      ) : (
        []
      )}
      <Typography variant="body3" color="text.secondary" align="center">
        {displayList.map((c, idx) => (idx === displayList.length - 1 ? `${c}` : `${c}, `))}
      </Typography>
    </Box>
  );
}
