import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, TextField, Button, Avatar } from '@mui/material';
import Spinner from './common/Spinner';

export default function EditUserProfileCard({ user, isLoading, handleUserFieldsChangedClick }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  useEffect(() => {
    setFirstName(user.firstName);
    setLastName(user.lastName);
  }, [user]);

  const onFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const onLastNameChange = (e) => {
    setLastName(e.target.value);
  };

  return (
    <Box component="form" sx={{ width: '100%' }} alignItems="stretch" justifyContent="center">
      <Grid container direction="column" justifyContent="center" alignItems="center" spacing={2}>
        <Grid item>
          <Typography
            sx={{ color: 'text.secondary', fontWeight: 'medium', fontSize: 25, pt: 2, mb: 2 }}
            align="center">
            Edit Profile
          </Typography>
        </Grid>

        {isLoading ? (
          <Spinner marginTop="1em" />
        ) : (
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={2}>
            <Grid item>
              <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={2}>
                <Grid item>
                  <Avatar
                    sx={{ width: '75px', height: '75px' }}
                    src={user.profilePicture}
                    loading="lazy"
                  />
                </Grid>
                <Grid item>
                  <Button> Upload Photo </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <TextField
                fullWidth
                required
                id="outlined-required"
                label="First Name"
                value={firstName}
                onChange={(e) => onFirstNameChange(e)}
              />
            </Grid>
            <Grid item>
              <TextField
                fullWidth
                required
                id="outlined-required"
                label="Last Name"
                value={lastName}
                onChange={(e) => onLastNameChange(e)}
              />
            </Grid>
            <Grid item>
              <Button sx={{ fontSize: '12px' }} href="/">
                Change your password
              </Button>
            </Grid>
            <Grid item>
              <Button
                onClick={() => {
                  handleUserFieldsChangedClick({ firstName, lastName });
                }}
                size="small"
                variant="outlined">
                Save
              </Button>
            </Grid>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
