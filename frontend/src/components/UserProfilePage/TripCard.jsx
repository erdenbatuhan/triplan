import React, { useState } from 'react';
import {
  Card,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Button
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TripPlanRatings from './TripPlanRatings';
import ServicesBoughtModal from './ServicesBoughtModal';

function TripCard({ tripPlan, viewMode }) {
  const [servicesBoughtShown, setServicesBoughtShown] = useState(false);

  return (
    <>
      <Card variant="outlined" sx={{ boxShadow: 2, height: '100%' }}>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1" gutterBottom>
              {tripPlan.name}
            </Typography>
          </AccordionSummary>

          <AccordionDetails sx={{ padding: 0 }}>
            <Grid sx={{ pr: 2 }} container item xs={12} justifyContent="flex-end">
              <Button size="small" onClick={() => setServicesBoughtShown(true)}>
                Services Bought
              </Button>
            </Grid>

            <TripPlanRatings tripPlanId={tripPlan._id} viewMode={viewMode} />
          </AccordionDetails>
        </Accordion>
      </Card>

      <ServicesBoughtModal
        open={servicesBoughtShown}
        onClose={() => setServicesBoughtShown(false)}
        tripPlan={tripPlan}
      />
    </>
  );
}

export default TripCard;
