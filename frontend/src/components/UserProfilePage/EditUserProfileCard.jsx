import React, { useState, useEffect } from 'react';
import { Box, Grid, TextField, Button } from '@mui/material';
import Spinner from '../common/Spinner';
import ImageUpload from '../common/ImageUpload';

export default function EditUserProfileCard({ user, isLoading, handleUserFieldsChange }) {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [profilePicture, setProfilePicture] = useState(user.profilePicture);

  useEffect(() => {
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setProfilePicture(user.profilePicture);
  }, [user]);

  const onFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const onLastNameChange = (e) => {
    setLastName(e.target.value);
  };

  const onProfileImageChange = (profilePictureUpdated) => {
    setProfilePicture(profilePictureUpdated);
  };

  return (
    <Box component="form" sx={{ width: '100%' }} justifyContent="center">
      <Grid container direction="column" justifyContent="center" spacing={2}>
        {isLoading ? (
          <Spinner marginTop="1em" />
        ) : (
          <Grid container direction="column" justifyContent="center" spacing={2}>
            <Grid sx={{ mt: 2, mb: 2 }} container item>
              <Grid item xs={3} />

              <Grid item xs={6}>
                <ImageUpload
                  objectId={user._id}
                  image={profilePicture}
                  onSaveSuccess={onProfileImageChange}
                />
              </Grid>

              <Grid item xs={3} />
            </Grid>

            <Grid container item>
              <Grid item xs={3} />

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  required
                  id="outlined-required"
                  label="First Name"
                  value={firstName}
                  onChange={(e) => onFirstNameChange(e)}
                />
              </Grid>

              <Grid item xs={3} />
            </Grid>

            <Grid container item>
              <Grid item xs={3} />

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  required
                  id="outlined-required"
                  label="Last Name"
                  value={lastName}
                  onChange={(e) => onLastNameChange(e)}
                />
              </Grid>

              <Grid item xs={3} />
            </Grid>

            <Grid container item>
              <Grid item xs={3} />

              <Grid
                container
                item
                direction="row"
                alignItems="center"
                justifyContent="center"
                xs={6}>
                <Button sx={{ fontSize: '12px' }} href="/">
                  Change your password
                </Button>
              </Grid>

              <Grid item xs={3} />
            </Grid>

            <Grid container item>
              <Grid item xs={3} />

              <Grid
                container
                item
                direction="row"
                alignItems="center"
                justifyContent="center"
                xs={6}>
                <Button
                  onClick={() => {
                    handleUserFieldsChange({ firstName, lastName, profilePicture });
                  }}
                  size="small"
                  variant="outlined">
                  Save
                </Button>
              </Grid>

              <Grid item xs={3} />
            </Grid>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
