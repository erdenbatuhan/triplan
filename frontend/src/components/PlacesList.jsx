import React, { useEffect, useState } from 'react';
import { Stack } from '@mui/material';
import PlaceCard from './PlaceCard';

export default function PlacesList({
  partnerLocations,
  selectedPartnerLocationObject,
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
    onSelectedPartnerLocationsChange({
      ...selectedPartnerLocationObject,
      selectedPartnerLocationId: partnerLocationDictionary[selectedPartnerLocationId]
    });
  };

  const deselectPartnerLocation = (deselectedPartnerLocationId) => {
    const selectedPartnerLocationsUpdated = { ...selectedPartnerLocationObject }; // Copy the object
    delete selectedPartnerLocationsUpdated[deselectedPartnerLocationId]; // Delete the deselected one

    onSelectedPartnerLocationsChange(selectedPartnerLocationsUpdated);
  };

  const isSelected = (partnerLocationToId) => {
    return selectedPartnerLocationObject[partnerLocationToId];
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
              cardSelected={isSelected(partnerLocation._id)}
              onPlaceCardSelect={selectPartnerLocation}
              onPlaceCardDeselect={deselectPartnerLocation}
            />
          ))
        : []}
    </Stack>
  );
}
