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

export default function UserItemCard({ user }) {
  return (
    <Card sx={{ display: 'flex', margin: '10px' }}>
      <Avatar sx={{ m: 2 }} />
      <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
        <CardActionArea>
          <CardContent sx={{ flex: '1 0 auto' }}>
            <Grid container flexDirection="row">
              <Grid item xs={6}>
                <Typography variant="subtitle1">{user.username}</Typography>

                <Typography variant="body2" color="text.secondary">
                  {user.username}
                </Typography>
              </Grid>
              <Grid item xs={6} p={1}>
                <Button size="small" variant="contained" color="primary">
                  Unfollow/Follow
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </CardActionArea>
      </Box>
    </Card>
  );
}
