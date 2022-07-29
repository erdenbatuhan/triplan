import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import MenuBookIcon from '@mui/icons-material/MenuBook';

export default function RestaurantCuisineDisplay({ displayList, isCuisine }) {
  return (
    <Box display="flex" flexDirection="row" justifyContent="center">
      {displayList.length > 0 ? (
        <IconButton
          disabled
          sx={{
            ml: 1,
            '&.MuiButtonBase-root:hover': {
              bgcolor: 'transparent'
            }
          }}>
          {isCuisine ? <RestaurantIcon /> : <MenuBookIcon />}
        </IconButton>
      ) : (
        []
      )}
      <Typography sx={{ mt: 1 }} variant="body3" align="center">
        {displayList.map((c, idx) => (idx === displayList.length - 1 ? `${c}` : `${c}, `))}
      </Typography>
    </Box>
  );
}
