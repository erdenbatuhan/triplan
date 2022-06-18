import { Button, Card } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

function TripCard(props) {
  const { tripName, isRated, href } = props;

  return (
    <Card>
      <div>{tripName}</div>
      {isRated ? <Button href={href}>Rated</Button> : <Button href={href}>Rate Trip</Button>}
    </Card>
  );
}

TripCard.propTypes = {
  tripName: PropTypes.string.isRequired,
  isRated: PropTypes.bool.isRequired,
  href: PropTypes.string.isRequired
};

// TripCard.defaultProps = {
// };

export default TripCard;
