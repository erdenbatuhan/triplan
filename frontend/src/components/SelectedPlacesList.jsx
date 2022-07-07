/* eslint-disable no-underscore-dangle */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { Stack } from '@mui/material';
import PlaceCard from './PlaceCard';

export default function SelectedPlacesList({ selectedPlaces }) {
  return (
    <Stack spacing={2}>
      {selectedPlaces
        ? selectedPlaces.map((selectedPlace) => (
            <PlaceCard
              key={selectedPlace._id}
              id={selectedPlace._id}
              title={selectedPlace.name}
              content={selectedPlace.place_description || ''}
              img_url={selectedPlace.locationPicture}
            />
          ))
        : []}
    </Stack>
  );
}
