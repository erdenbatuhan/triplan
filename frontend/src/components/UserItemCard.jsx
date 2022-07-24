import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Grid,
  CardActionArea
} from '@mui/material';

export default function UserItemCard({
  user,
  numTripsPlannedByUser,
  followingsButtonText,
  onFollowingsButtonClick
}) {
  return (
    <Card sx={{ display: 'flex', margin: '10px' }}>
      <Avatar sx={{ m: 2 }} src={user.profilePicture} loading="lazy" />

      <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
        <CardActionArea>
          <CardContent sx={{ flex: '1 0 auto' }}>
            <Grid container flexDirection="row">
              <Grid item xs={6}>
                <Typography variant="subtitle1">{user.username}</Typography>

                <Typography variant="body5" color="text.secondary">
                  Has planned {numTripsPlannedByUser || 'no'} trips so far
                </Typography>
              </Grid>
              <Grid item xs={6} p={1}>
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  onClick={() => onFollowingsButtonClick(user._id)}>
                  {followingsButtonText}
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </CardActionArea>
      </Box>
    </Card>
  );
}
