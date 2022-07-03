/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { Stack } from '@mui/material';
import PlaceCard from './PlaceCard';

export default function SelectedPlacesList(props) {
  return (
    <Stack spacing={2}>
      {props.selectedPlaces.map((selectedPlace) => {
        return (
          <PlaceCard
            key={selectedPlace.google_place_id}
            id={selectedPlace._id}
            title={selectedPlace.name}
            content={selectedPlace.place_description}
            img_url={selectedPlace.google_icon_url}
          />
        );
      })}
    </Stack>
  );
}
