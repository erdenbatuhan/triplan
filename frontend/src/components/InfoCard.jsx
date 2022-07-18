import { useNavigate } from 'react-router-dom';
import { Card, Grid, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

function InfoCard(props) {
  const { title, value, href } = props;
  const navigate = useNavigate();

  const cardClickHandler = () => {
    navigate(href);
  };

  const emptyFunction = () => {};
  return (
    <Card
      onClick={href !== 'None' ? cardClickHandler : emptyFunction}
      sx={{ minWidth: 150 }}
      variant="outlined">
      <Grid container direction="column" justifyContent="center" alignItems="center">
        <Grid item xs={9}>
          <Typography variant="h6" color="text.primary" align="center">
            {title}:
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography align="center">{value}</Typography>
        </Grid>
      </Grid>
    </Card>
  );
}

InfoCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  href: PropTypes.string
};

InfoCard.defaultProps = {
  href: 'None'
};

export default InfoCard;
