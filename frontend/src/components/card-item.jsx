/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-unused-prop-types */
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import ListItem from '@mui/material/ListItem';
import { CardActionArea } from '@mui/material';
import PropTypes from 'prop-types';
import PlaceImg from './assets/place.png';
import RestaurantImg from './assets/restaurant.png';

export default function TripPlanningCard(props) {
  let imgPath = '';
  if (props.type === 'restaurant') {
    imgPath = RestaurantImg;
  } else {
    imgPath = PlaceImg;
  }
  return (
    <Card sx={{ maxWidth: 500 }}>
      <CardActionArea>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <ListItem>
              <CardMedia component="img" image={imgPath} />
            </ListItem>
          </Grid>
          <Grid item xs={8}>
            <ListItem>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {props.title}
                </Typography>
                {/* <Typography variant="body2" color="text.secondary">
                  {props.content}
                </Typography> */}
              </CardContent>
            </ListItem>
          </Grid>
        </Grid>
      </CardActionArea>
    </Card>
  );
}

TripPlanningCard.propTypes = {
  title: PropTypes.string.isRequired,
  // content: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired
};
