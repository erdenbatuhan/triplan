import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import ListItem from '@mui/material/ListItem';
import { CardActionArea } from '@mui/material';

export default function PlaceCard({
  id,
  title,
  content,
  locationPicture,
  onPlaceCardSelect,
  onPlaceCardDeselect
}) {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked((oldVal) => {
      const newVal = !oldVal;

      if (newVal) {
        onPlaceCardSelect(id);
      } else {
        onPlaceCardDeselect(id);
      }

      return newVal;
    });
  };

  return (
    <Card
      sx={{ maxWidth: '%100', height: '20vh' }}
      style={{ backgroundColor: isClicked ? '#c5e1a5' : '' }}>
      <CardActionArea onClick={handleClick}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '20vh'
              }}>
              <CardMedia
                component="img"
                sx={{ width: '15vh', height: '15vh' }}
                image={locationPicture}
                alt={locationPicture}
              />
            </div>
          </Grid>
          <Grid item xs={8}>
            <ListItem>
              <CardContent>
                <Typography gutterBottom variant="h6" component="text.primary">
                  {title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {content}
                </Typography>
              </CardContent>
            </ListItem>
          </Grid>
        </Grid>
      </CardActionArea>
    </Card>
  );
}
