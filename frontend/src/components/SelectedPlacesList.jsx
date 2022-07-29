import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Grid } from '@mui/material';
import PlaceCard from './PlaceCard';

export default function SelectedPlacesList({ selectedPartnerLocationObject }) {
  const { state } = useLocation();
  const [selectedPartnerLocations, setSelectedPartnerLocations] = useState([]);

  // Listening to the changes in selectedPartnerLocationObject
  useEffect(() => {
    setSelectedPartnerLocations(Object.values(Object.values(selectedPartnerLocationObject)));
  }, [selectedPartnerLocationObject]);

  const navigate = useNavigate();
  const goToPlaceProfile = (partnerLocationId) => {
    navigate(`/partner-profile/${partnerLocationId}`, {
      state: {
        ...state,
        currentlySelectedPartnerLocations: selectedPartnerLocations
      }
    });
  };

  return (
    <Grid>
      {selectedPartnerLocations
        ? selectedPartnerLocations.map((partnerLocation) => (
            <PlaceCard
              key={`selected-${partnerLocation._id}`}
              partnerLocation={partnerLocation}
              onPlaceCardSelect={goToPlaceProfile}
              smaller
            />
          ))
        : []}
    </Grid>
  );
}
