/* eslint-disable react/jsx-key */
import React from 'react';
import { List, Typography, Grid } from '@mui/material';
import UserItemCard from './UserItemCard';

export default function FollowingsCard({ listName, list }) {
  return (
    <Grid sx={{ width: '100%' }} alignItems="stretch">
      <Typography
        sx={{ color: 'text.secondary', fontWeight: 'medium', fontSize: 25 }}
        align="center">
        {listName}
      </Typography>
      <List
        sx={{
          width: '100%',
          bgcolor: 'background.paper',
          overflow: 'auto',
          '& ul': { padding: 0 }
        }}>
        {list
          ? list.map((user) => {
              return <UserItemCard user={user} />;
            })
          : []}
      </List>
    </Grid>
  );
}