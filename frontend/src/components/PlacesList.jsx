import React, { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import PlaceCard from './PlaceCard';

// const PAGE_SIZE = 10;

export default function PlacesList({
  partnerLocations,
  selectedPartnerLocationObject,
  onSelectedPartnerLocationsChange
}) {
  const [partnerLocationDictionary, setPartnerLocationDictionary] = useState({});
  // const [currentPage, setCurrentPage] = useState([]);

  // Listening to the changes in partnerLocations
  useEffect(() => {
    // The dictionary is used for O(1) access
    setPartnerLocationDictionary(
      Object.assign(
        {},
        ...partnerLocations.map((partnerLocation) => ({ [partnerLocation._id]: partnerLocation }))
      )
    );
    // setCurrentPage(Array.from({ length: PAGE_SIZE }, (_, idx) => idx));
  }, [partnerLocations]);

  const selectPartnerLocation = (selectedPartnerLocationId) => {
    onSelectedPartnerLocationsChange({
      ...selectedPartnerLocationObject,
      [selectedPartnerLocationId]: partnerLocationDictionary[selectedPartnerLocationId]
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
    <Grid>
      {partnerLocations
        ? partnerLocations.map((partnerLocation) => (
            <PlaceCard
              key={partnerLocation._id}
              partnerLocation={partnerLocation}
              cardSelected={isSelected(partnerLocation._id)}
              onPlaceCardSelect={selectPartnerLocation}
              onPlaceCardDeselect={deselectPartnerLocation}
            />
          ))
        : []}
    </Grid>
  );
}
