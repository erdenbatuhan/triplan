/* eslint-disable react/no-array-index-key */ // REMOVE WHEN WE HAVE BOTH RESTAURANTS AND TOURIST ATTRACTIONS
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-alert */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { useEffect, useState } from 'react';
import { Stack } from '@mui/material';
import PlaceCard from './PlaceCard';

export default function PlacesList({ placeData, selectedPlaces, onSelectedPlacesChange }) {
  const [placeDataDictionary, setPlaceDataDictionary] = useState({});

  // Listening to the changes in the props
  useEffect(() => {
    // The dictionary is used for O(1) access
    setPlaceDataDictionary(
      Object.assign(
        {},
        ...placeData.map((place) => {
          return { [place._id]: place };
        })
      )
    );
  }, [placeData]);

  const placeCardSelected = (selectedPlaceId) => {
    selectedPlaces.push(placeDataDictionary[selectedPlaceId]);
    onSelectedPlacesChange(selectedPlaces);
  };

  const placeCardDeselected = (deselectedPlaceId) => {
    selectedPlaces.splice(selectedPlaces.indexOf(placeDataDictionary[deselectedPlaceId]), 1);
    onSelectedPlacesChange(selectedPlaces);
  };

  return (
    <Stack spacing={2}>
      {placeData
        ? placeData.map((place, idx) => (
            <PlaceCard
              key={`${idx}-${place._id}`} // Note: Just use _id when we have both restaurants and tourist attractions
              id={place._id}
              title={place.name}
              content={place.place_description}
              img_url={place.google_icon_url}
              onPlaceCardSelect={placeCardSelected}
              onPlaceCardDeselect={placeCardDeselected}
            />
          ))
        : []}
    </Stack>
  );
}
