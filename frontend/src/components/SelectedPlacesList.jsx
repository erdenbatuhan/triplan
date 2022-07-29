import React, { useState, useEffect } from 'react';
import { Grid } from '@mui/material';
import PlaceCard from './PlaceCard';

export default function SelectedPlacesList({
  selectedPartnerLocationObject,
  onSelectedPartnerLocationsChange
}) {
  const [selectedPartnerLocations, setSelectedPartnerLocations] = useState([]);

  // Listening to the changes in selectedPartnerLocationObject
  useEffect(() => {
    setSelectedPartnerLocations(Object.values(Object.values(selectedPartnerLocationObject)));
  }, [selectedPartnerLocationObject]);

  const deselectPartnerLocation = (deselectedPartnerLocationId) => {
    const selectedPartnerLocationsUpdated = { ...selectedPartnerLocationObject }; // Copy the object
    delete selectedPartnerLocationsUpdated[deselectedPartnerLocationId]; // Delete the deselected one

    onSelectedPartnerLocationsChange(selectedPartnerLocationsUpdated);
  };

  return (
    <Grid>
      {selectedPartnerLocations
        ? selectedPartnerLocations.map((partnerLocation) => (
            <PlaceCard
              key={`selected-${partnerLocation._id}`}
              partnerLocation={partnerLocation}
              onPlaceCardSelect={deselectPartnerLocation}
              smaller
            />
          ))
        : []}
    </Grid>
  );
}
