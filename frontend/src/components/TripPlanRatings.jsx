import React, { useEffect, useState } from 'react';
import { Box, List } from '@mui/material';
import TripPlanRatingCard from './TripPlanRatingCard';
import { getLocationsOfTripPlan } from '../queries/trip-plan-queries';

export default function TripPlanRatings({ tripPlanId }) {
  const [detailedLocations, setDetailedLocations] = useState([]);

  // Listening to the change in tripPlanId
  useEffect(() => {
    getLocationsOfTripPlan(tripPlanId).then((data) => setDetailedLocations(data));
  }, [tripPlanId]);

  const onChangesSaved = ({ index, savedTripLocation }) => {
    const updatedDetailedTripLocations = [...detailedLocations]; // Create a copy of the new list to force re-rendering
    updatedDetailedTripLocations[index].tripLocation = savedTripLocation;

    setDetailedLocations(updatedDetailedTripLocations);
  };

  return (
    <div>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
        <List
          sx={{
            width: '100%',
            bgcolor: 'background.paper',
            position: 'relative',
            overflow: 'auto',
            minHeight: '1.5em',
            maxHeight: '25em',
            marginTop: '10px',
            '& ul': { padding: 0 }
          }}>
          {detailedLocations.map(({ tripLocation, partnerLocation }, idx) => (
            <TripPlanRatingCard
              key={tripLocation._id}
              index={idx}
              ranking={idx + 1}
              tripLocation={tripLocation}
              partnerLocation={partnerLocation}
              onChangesSaved={onChangesSaved}
              latestUpdate={tripLocation.updatedAt}
            />
          ))}
        </List>
      </Box>
    </div>
  );
}
