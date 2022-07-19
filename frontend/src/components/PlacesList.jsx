import React, { useEffect, useState } from 'react';
import { Stack } from '@mui/material';
import PlaceCard from './PlaceCard';

export default function PlacesList({
  partnerLocations,
  selectedPartnerLocations,
  partnerLocationType,
  onSelectedPartnerLocationsChange
}) {
  const [partnerLocationDictionary, setPartnerLocationDictionary] = useState({});

  // Listening to the changes in partnerLocations
  useEffect(() => {
    // The dictionary is used for O(1) access
    setPartnerLocationDictionary(
      Object.assign(
        {},
        ...partnerLocations.map((partnerLocation) => ({ [partnerLocation._id]: partnerLocation }))
      )
    );
  }, [partnerLocations]);

  const selectPartnerLocation = (selectedPartnerLocationId) => {
    selectedPartnerLocations.push({
      partnerLocation: partnerLocationDictionary[selectedPartnerLocationId],
      partnerLocationType
    });
    onSelectedPartnerLocationsChange(selectedPartnerLocations);
  };

  const deselectPartnerLocation = (deselectedPartnerLocationId) => {
    const selectedPartnerLocationIds = selectedPartnerLocations.map(
      ({ partnerLocation }) => partnerLocation._id
    );

    selectedPartnerLocations.splice(
      selectedPartnerLocationIds.indexOf(deselectedPartnerLocationId),
      1
    );
    onSelectedPartnerLocationsChange(selectedPartnerLocations);
  };

  const isSelected = (partnerLocationToCheck) => {
    return selectedPartnerLocations.some(({ partnerLocation }) => {
      return partnerLocationToCheck === partnerLocation;
    });
  };

  return (
    <Stack spacing={2}>
      {partnerLocations
        ? partnerLocations.map((partnerLocation) => (
            <PlaceCard
              key={partnerLocation._id}
              id={partnerLocation._id}
              title={partnerLocation.name}
              content={partnerLocation.place_description || ''}
              locationPicture={partnerLocation.locationPicture}
              cardSelected={isSelected(partnerLocation)}
              onPlaceCardSelect={selectPartnerLocation}
              onPlaceCardDeselect={deselectPartnerLocation}
            />
          ))
        : []}
    </Stack>
  );
}
