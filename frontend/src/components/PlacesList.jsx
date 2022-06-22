/* eslint-disable react/destructuring-assignment */
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Stack } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import PlaceCard from './PlaceCard';
import { getPlaceData } from '../queries/place-data-queries';

export default function PlacesList() {
  const [placeData, setPlaceData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getPlaceData().then((data) => setPlaceData(data));
    setLoading(false);
  }, []);
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
            title={place.name}
            content={place.place_description}
            img_url={place.google_icon_url}
          />
        );
      })}
    </Stack>
  );
}
