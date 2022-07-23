import { Button, Card, CardActions, Typography, Grid, Modal } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 6,
  borderRadius: '15px'
};

function TripCard(props) {
  const { name /* , isRated */ } = props;
  const [openSummary, setOpenSummary] = useState(false);

  return (
    <Card variant="outlined" sx={{ boxShadow: 2, height: '100%' }}>
      <Grid container justifyContent="center" alignItems="center" sx={{ p: 1, mx: 1 }}>
        <Grid item xs={9}>
          <Typography align="center">{name}</Typography>
        </Grid>
        <Grid item xs={3}>
          <CardActions>
            <Button
              onClick={() => {
                setOpenSummary(true);
              }}>
              {/* isRated ? 'Rated' : 'Rate Trip' */}
            </Button>
          </CardActions>
        </Grid>
      </Grid>
      <Modal
        open={openSummary}
        onClose={() => {
          setOpenSummary(false);
        }}>
        <Card sx={style}>
          <Typography color="text.secondary" variant="h6">
            Your trip summary
          </Typography>
        </Card>
      </Modal>
    </Card>
  );
}

TripCard.propTypes = {
  name: PropTypes.string.isRequired
  // isRated: PropTypes.bool.isRequired
};

export default TripCard;
