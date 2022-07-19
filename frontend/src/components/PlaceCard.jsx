import React from 'react';
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
  cardSelected,
  onPlaceCardSelect,
  onPlaceCardDeselect
}) {
  const handleCardSelection = () => {
    if (cardSelected) {
      // Was selected, now de-selecting
      onPlaceCardDeselect(id);
    } else {
      // Was "not" selected, now selecting
      onPlaceCardSelect(id);
    }
  };

  return (
    <Card
      sx={{ maxWidth: '%100', height: '20vh' }}
      style={{ backgroundColor: cardSelected ? '#c5e1a5' : '' }}>
      <CardActionArea onClick={handleCardSelection}>
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
                <Typography gutterBottom variant="h6" color="text.primary">
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
