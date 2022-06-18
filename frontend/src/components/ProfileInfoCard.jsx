import { useNavigate } from 'react-router-dom';
import { Card, Grid, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

function ProfileInfoCard(props) {
  const { title, value, href } = props;
  const navigate = useNavigate();

  const cardClickHandler = () => {
    navigate(href);
  };

  return (
    <Card onClick={cardClickHandler} sx={{ minWidth: 150 }} variant="outlined">
      <Grid container direction="column" justifyContent="center" alignItems="center">
        <Grid item xs={9}>
          <Typography align="center">{title}</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography align="center">{value}</Typography>
        </Grid>
      </Grid>
    </Card>
  );
}

ProfileInfoCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired
};

// ProfileInfoCard.defaultProps = {
// };

export default ProfileInfoCard;
