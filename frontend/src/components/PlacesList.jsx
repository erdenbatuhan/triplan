import React, { useEffect, useState } from 'react';
import { Stack } from '@mui/material';
import PlaceCard from './PlaceCard';

export default function PlacesList({ places, selectedPlaces, onSelectedPlacesChange }) {
  const [placesDictionary, setPlacesDictionary] = useState({});

  // Listening to the changes in places
  useEffect(() => {
    // The dictionary is used for O(1) access
    setPlacesDictionary(Object.assign({}, ...places.map((place) => ({ [place._id]: place }))));
  }, [places]);

  const placeCardSelected = (selectedPlaceId) => {
    selectedPlaces.push(placesDictionary[selectedPlaceId]);
    onSelectedPlacesChange(selectedPlaces);
  };

  const placeCardDeselected = (deselectedPlaceId) => {
    selectedPlaces.splice(selectedPlaces.indexOf(placesDictionary[deselectedPlaceId]), 1);
    onSelectedPlacesChange(selectedPlaces);
  };

  return (
    <Stack spacing={2}>
      {places
        ? places.map((place) => (
            <PlaceCard
              key={place._id}
              id={place._id}
              title={place.name}
              content={place.place_description || ''}
              locationPicture={place.locationPicture}
              onPlaceCardSelect={placeCardSelected}
              onPlaceCardDeselect={placeCardDeselected}
            />
          ))
        : []}
    </Stack>
  );
}
