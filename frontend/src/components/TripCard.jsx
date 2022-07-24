import React from 'react';
import { Card, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TripPlanRatings from './TripPlanRatings';

function TripCard({ tripPlan }) {
  const [accordionOpen, setAccordionOpen] = React.useState(false);

  return (
    <Card variant="outlined" sx={{ boxShadow: 2, height: '100%' }}>
      <Accordion
        sx={{ backgroundColor: accordionOpen ? '#e1f5fe' : '#ffffff' }}
        onChange={() => setAccordionOpen((cur) => !cur)}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1" gutterBottom>
            {tripPlan.name}
          </Typography>
        </AccordionSummary>

        <AccordionDetails sx={{ padding: 0 }}>
          <TripPlanRatings tripPlanId={tripPlan._id} />
        </AccordionDetails>
      </Accordion>
    </Card>
  );
}

export default TripCard;
