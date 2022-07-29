import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import ListItem from '@mui/material/ListItem';
import { Avatar, CardActionArea } from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import MapIcon from '@mui/icons-material/Map';
import { PARTNER_TYPE_RESTAURANT } from '../shared/constants';

export default function PlaceCard({
  partnerLocation,
  cardSelected,
  onPlaceCardSelect,
  onPlaceCardDeselect
}) {
  const handleCardSelection = () => {
    if (cardSelected) {
      // Was selected, now de-selecting
      onPlaceCardDeselect(partnerLocation._id);
    } else {
      // Was "not" selected, now selecting
      onPlaceCardSelect(partnerLocation._id);
    }
  };

  return (
    <Card
      sx={{ width: '%100', height: '20vh', m: 1 }}
      style={{ backgroundColor: cardSelected ? '#c5e1a5' : '' }}>
      <CardActionArea onClick={handleCardSelection}>
        {partnerLocation ? (
          <Grid container spacing={2}>
            <Grid item xs={1} />

            <Grid item xs={3}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '20vh'
                }}>
                {partnerLocation.locationPicture ? (
                  <Avatar
                    sx={{
                      width: '125px',
                      height: '125px'
                    }}
                    src={partnerLocation.locationPicture}
                  />
                ) : (
                  <Avatar
                    sx={{
                      width: '125px',
                      height: '125px'
                    }}>
                    {partnerLocation.partnerType === PARTNER_TYPE_RESTAURANT ? (
                      <RestaurantIcon sx={{ width: '50%', height: '50%' }} />
                    ) : (
                      <MapIcon sx={{ width: '50%', height: '50%' }} />
                    )}
                  </Avatar>
                )}
              </div>
            </Grid>

            <Grid item xs={8}>
              <ListItem>
                <CardContent>
                  <Typography gutterBottom fontSize="medium" variant="h6" color="text.primary">
                    {partnerLocation.name}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    {partnerLocation.description}
                  </Typography>

                  <br />

                  <Typography variant="body3" color="text.secondary">
                    {partnerLocation.address}
                  </Typography>
                </CardContent>
              </ListItem>
            </Grid>
          </Grid>
        ) : (
          []
        )}
      </CardActionArea>
    </Card>
  );
}
