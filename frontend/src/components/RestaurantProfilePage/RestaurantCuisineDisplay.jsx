import React from 'react';
import { Typography } from '@mui/material';

function RestaurantCuisineDisplay(props) {
  const { cuisineList } = props;
  return (
    <div>
      <Typography variant="h6" color="text.primary" align="center">
        Cuisines:
      </Typography>

      {cuisineList.map((c) => (
        <Typography key={c} variant="body2" color="text.secondary" align="center">
          {c}
        </Typography>
      ))}
    </div>
  );
}

export default RestaurantCuisineDisplay;
