/* eslint-disable react/jsx-key */
import React from 'react';
import { List, ListItem, ListItemText, Divider, Typography, Grid } from '@mui/material';

const style = {
  width: '100%',
  maxWidth: 360,
  bgcolor: 'background.paper'
};

export default function FollowingsCard({ listName, list }) {
  return (
    <Grid>
      <Typography> {listName} </Typography>
      <List sx={style} component="nav" aria-label="mailbox folders">
        {list
          ? list.map((user) => {
              return (
                <Grid>
                  <ListItem button>
                    <ListItemText> {user.username}</ListItemText>
                  </ListItem>
                  <Divider />
                </Grid>
              );
            })
          : []}
      </List>
    </Grid>
  );
}
