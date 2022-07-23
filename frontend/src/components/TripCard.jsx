import { Card, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PropTypes from 'prop-types';
import React from 'react';

function TripCard({ name }) {
  return (
    <Card variant="outlined" sx={{ boxShadow: 2, height: '100%' }}>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{name}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Your trip summary</Typography>
        </AccordionDetails>
      </Accordion>
    </Card>
  );
}

TripCard.propTypes = {
  name: PropTypes.string.isRequired
};

export default TripCard;
