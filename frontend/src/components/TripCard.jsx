import { Button, Card, CardActions, Typography, Grid } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

function TripCard(props) {
  const { tripName, isRated, href } = props;

  return (
    <Card sx={{ minWidth: 550 }} variant="outlined">
      <Grid container justifyContent="center" alignItems="center">
        <Grid item xs={9}>
          <Typography align="center">{tripName}</Typography>
        </Grid>
        <Grid item xs={3}>
          <CardActions>
            <Button href={href}>{isRated ? 'Rated' : 'Rate Trip'}</Button>
          </CardActions>
        </Grid>
      </Grid>
    </Card>
  );
}

TripCard.propTypes = {
  tripName: PropTypes.string.isRequired,
  isRated: PropTypes.bool.isRequired,
  href: PropTypes.string.isRequired
};

export default TripCard;
