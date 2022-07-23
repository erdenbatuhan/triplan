import { Card, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PropTypes from 'prop-types';
import React from 'react';

function TripCard(props) {
  const { name /* , isRated */ } = props;

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
  // isRated: PropTypes.bool.isRequired
};

export default TripCard;
