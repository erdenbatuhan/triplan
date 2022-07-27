import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Grid,
  CardActionArea,
  IconButton,
  Tooltip
} from '@mui/material';
import AccountBoxIcon from '@mui/icons-material/AccountBox';

export default function UserItemCard({
  user,
  numTripsPlannedByUser,
  followingsButtonText,
  onFollowingsButtonClick
}) {
  const [buttonsVisible] = useState(!!followingsButtonText);

  const navigate = useNavigate();

  const navigateToUserProfile = (userId) => {
    navigate(`/user/${userId}`);
  };

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

              <Grid item xs={4} p={1}>
                {buttonsVisible ? (
                  <Button
                    sx={{ width: '100%', height: '30px', position: 'relative', zIndex: 1 }}
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={() => onFollowingsButtonClick(user._id)}>
                    {followingsButtonText}
                  </Button>
                ) : (
                  []
                )}
              </Grid>

              <Grid item xs={2}>
                <Tooltip title="See profile">
                  <IconButton onClick={() => navigateToUserProfile(user._id)}>
                    <AccountBoxIcon
                      sx={{ position: 'relative', zIndex: 1, width: '30px', height: '30px' }}
                      color="primary"
                    />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </CardContent>
        </CardActionArea>
      </Box>
    </Card>
  );
}
