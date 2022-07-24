import React from 'react';
import { Stack } from '@mui/material';
import PlaceCard from './PlaceCard';

export default function SelectedPlacesList({ selectedPartnerLocations }) {
  return (
    <Stack spacing={2}>
      {selectedPartnerLocations
        ? selectedPartnerLocations.map((partnerLocation) => (
            <PlaceCard
              key={partnerLocation._id}
              id={partnerLocation._id}
              title={partnerLocation.name}
              content={partnerLocation.description || ''}
              locationPicture={partnerLocation.locationPicture}
            />
          ))
        : []}
    </Stack>
  );
}
