import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import TripLocationSummaryCard from '../components/TripPlanSummaryCard';
import { getTripPlan, getDetailedTripLocationsOfTripPlan } from '../queries/trip-plan-queries';

export default function TripLocationSummaryPage() {
  const [tripPlan, setTripPlan] = useState({});
  const [detailedTripLocations, setDetailedTripLocations] = useState([]);

  // Fetch all the trip locations of the trip plan for every change in trip plan ID
  const { tripPlanId } = useParams();
  useEffect(() => {
    getTripPlan(tripPlanId).then((data) => setTripPlan(data));
    getDetailedTripLocationsOfTripPlan(tripPlanId).then((data) => setDetailedTripLocations(data));
  }, [tripPlanId]);

  const onChangesSaved = ({ index, savedTripLocation }) => {
    const updatedDetailedTripLocations = [...detailedTripLocations]; // Create a copy of the new list to force re-rendering
    updatedDetailedTripLocations[index].tripLocation = savedTripLocation;

    setDetailedTripLocations(updatedDetailedTripLocations);
  };

  return (
    <div>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: '2em'
        }}>
        <h4>{tripPlan.name} - Summary</h4>

        {detailedTripLocations.map(({ tripLocation, partnerLocation }, idx) => (
          <TripLocationSummaryCard
            key={tripLocation._id}
            index={idx}
            ranking={idx + 1}
            tripLocation={tripLocation}
            partnerLocation={partnerLocation}
            onChangesSaved={onChangesSaved}
            latestUpdate={tripLocation.updatedAt}
          />
        ))}
      </Box>
    </div>
  );
}
