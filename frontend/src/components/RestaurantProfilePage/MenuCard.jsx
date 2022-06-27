/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-unused-prop-types */
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import ListItem from '@mui/material/ListItem';
import PropTypes from 'prop-types';

export default function PlaceCard(props) {
  return (
    <Card sx={{ maxWidth: '%100' }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <img
              src={`${props.img_url}?w=164&h=164&fit=crop&auto=format`}
              srcSet={`${props.img_url}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
              alt=""
              loading="lazy"
              width={150}
              height={150}
            />
          </Grid>
          <Grid item xs={6}>
            <ListItem>
              <CardContent>
                <Typography gutterBottom variant="h3" component="div">
                  {props.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {props.content}
                </Typography>
              </CardContent>
            </ListItem>
          </Grid>
          <Grid item xs={3}>
            <CardContent>
              <Typography variant="h5" color="text.secondary">
                {props.price}
              </Typography>
            </CardContent>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

PlaceCard.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  img_url: PropTypes.string.isRequired
};
