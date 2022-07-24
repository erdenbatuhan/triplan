import React from 'react';
import { Card, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TripPlanRatings from './TripPlanRatings';

function TripCard({ tripPlan }) {
  return (
    <Card variant="outlined" sx={{ boxShadow: 2, height: '100%' }}>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography> {tripPlan.name} </Typography>
        </AccordionSummary>

        <AccordionDetails sx={{ padding: 0, backgroundColor: '#eeeeee' }}>
          <TripPlanRatings tripPlanId={tripPlan._id} />
        </AccordionDetails>
      </Accordion>
    </Card>
  );
}

export default TripCard;
