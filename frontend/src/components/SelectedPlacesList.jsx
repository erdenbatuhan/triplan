import React from 'react';
import { Grid } from '@mui/material';
import PlaceCard from './PlaceCard';

export default function SelectedPlacesList({ selectedPartnerLocations }) {
  return (
    <Grid>
      {selectedPartnerLocations
        ? selectedPartnerLocations.map((partnerLocation) => (
            <PlaceCard
              key={`selected-${partnerLocation._id}`}
              partnerLocation={partnerLocation}
              onPlaceCardSelect={() => false}
              onPlaceCardDeselect={() => false}
              smaller
            />
          ))
        : []}
    </Grid>
  );
}
