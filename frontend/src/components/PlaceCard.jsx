/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-unused-prop-types */
import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
// import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import ListItem from '@mui/material/ListItem';
import { CardActionArea } from '@mui/material';
import PropTypes from 'prop-types';

export default function PlaceCard(props) {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked((oldVal) => {
      const newVal = !oldVal;

      if (newVal) {
        props.onPlaceCardSelect(props.id);
      } else {
        props.onPlaceCardDeselect(props.id);
      }

      return newVal;
    });
  };

  return (
    <Card sx={{ maxWidth: '%100' }} style={{ backgroundColor: isClicked ? '#c5e1a5' : '' }}>
      <CardActionArea onClick={handleClick}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <img
              src={`${props.img_url}?w=164&h=164&fit=crop&auto=format`}
              srcSet={`${props.img_url}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
              alt=""
              loading="lazy"
            />
            {/* <ListItem>
              <CardMedia component="img" image={imgPath} />
            </ListItem> */}
          </Grid>
          <Grid item xs={8}>
            <ListItem>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {props.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {props.content}
                </Typography>
              </CardContent>
            </ListItem>
          </Grid>
        </Grid>
      </CardActionArea>
    </Card>
  );
}

PlaceCard.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  img_url: PropTypes.string.isRequired
};
