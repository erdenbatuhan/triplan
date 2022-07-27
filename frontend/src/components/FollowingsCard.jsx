import React from 'react';
import { List, Typography, Grid } from '@mui/material';
import UserItemCard from './UserItemCard';

export default function FollowingsCard({
  listName,
  list,
  numTripsPlannedByUsers,
  isFollowed,
  isGivenUserAuthenticatedUser,
  onFollowingsButtonClick
}) {
  const getFollowingButtonTextForUser = (userId) => {
    if (isGivenUserAuthenticatedUser(userId)) {
      return false;
    }

    return isFollowed(userId) ? 'Unfollow' : 'Follow';
  };

  return (
    <Grid sx={{ width: '100%' }} alignItems="stretch">
      <Typography
        sx={{ color: 'text.secondary', fontWeight: 'medium', fontSize: 25, pt: 2 }}
        align="center">
        {listName}
      </Typography>
      <List
        sx={{
          width: '100%',
          minWidth: '30em',
          bgcolor: 'background.paper',
          overflow: 'auto',
          height: '20em',
          '& ul': { padding: 0 }
        }}>
        {list
          ? list.map((user) => {
              return (
                <UserItemCard
                  key={`${listName}-${user._id}`}
                  user={user}
                  numTripsPlannedByUser={numTripsPlannedByUsers[user._id]}
                  followingsButtonText={getFollowingButtonTextForUser(user._id)}
                  onFollowingsButtonClick={onFollowingsButtonClick}
                />
              );
            })
          : []}
      </List>
    </Grid>
  );
}
