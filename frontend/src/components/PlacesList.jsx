/* eslint-disable no-underscore-dangle */
/* eslint-disable no-alert */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Stack } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import PlaceCard from './PlaceCard';
import { getPlaceData } from '../queries/place-data-queries';

export default function PlacesList(props) {
  const [placeData, setPlaceData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getPlaceData().then((data) => setPlaceData(data));
    setLoading(false);
  }, []);

  const cardSelected = (placeSelectedId) => {
    const selectedPlacesUpdated = props.selectedPlaces;
    console.log(selectedPlacesUpdated);
    selectedPlacesUpdated.push(placeSelectedId);
    props.onSelectedPlacesChange(selectedPlacesUpdated);
  };

  const cardDeselected = (placeDeselectedId) => {
    const selectedPlacesUpdated = props.selectedPlaces;

    selectedPlacesUpdated.splice(selectedPlacesUpdated.indexOf(placeDeselectedId), 1);
    props.onSelectedPlacesChange(selectedPlacesUpdated);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Stack spacing={2}>
      {placeData.map((place) => {
        return (
          <PlaceCard
            key={place.google_place_id}
            id={place._id}
            title={place.name}
            content={place.place_description}
            img_url={place.google_icon_url}
            onCardSelect={cardSelected}
            onCardDeselect={cardDeselected}
          />
        );
      })}
    </Stack>
  );
}
