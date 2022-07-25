import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Grid, TextField, Button } from '@mui/material';
import { green, grey } from '@mui/material/colors';
import { SECONDARY_COLOR } from '../shared/constants';

function SignUpUserDataPage() {
  const [firstName, setFirstName] = useState('Eralp');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [profilePicture, setProfilePicture] = useState('');

  const location = useLocation();
  const authData = location.state ? location.state.authData : null;

  const [width, setWidth] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    setWidth(ref.current.offsetWidth);
  }, []);

  const onFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };
  const onLastNameChange = (e) => {
    setLastName(e.target.value);
  };
  const onPhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };
  const onProfilePictureChange = (e) => {
    setProfilePicture(e.target.value);
  };

  const handleOnSubmitClick = async () => {
    try {
      const userData = { firstName, lastName, phoneNumber };
      if (!authData) {
        console.error(`authentication data is missing ${authData}`);
      }
      const signupData = { authData, userData };
      console.log('signupData: ', signupData);
    } catch (e) {
      console.error(`failed to create user ${e}`);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: SECONDARY_COLOR
      }}>
      <Box
        component="form"
        noValidate
        sx={{
          mt: 4,
          marginLeft: 5,
          marginRight: 5,
          marginBottom: 5
        }}>
        <Box
          ref={ref}
          sx={{
            alignItems: 'center',
            justifyContent: 'center',
            border: 1,
            borderRadius: 4,
            borderColor: grey[500],
            padding: 1
          }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: 5
            }}
          />
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={2}>
            <br />
            <Grid item>
              <TextField
                required
                fullWidth
                id="outlined-required"
                label="First Name"
                defaultValue={firstName}
                onChange={(e) => onFirstNameChange(e)}
                style={{ width: width * 0.8 }}
              />
            </Grid>
            <Grid item>
              <TextField
                required
                id="outlined-required"
                label="Last Name"
                defaultValue={lastName}
                onChange={(e) => onLastNameChange(e)}
                style={{ width: width * 0.8 }}
              />
            </Grid>
            <Grid item>
              <TextField
                required
                id="outlined-required"
                label="Phone Number"
                defaultValue={phoneNumber}
                onChange={(e) => onPhoneNumberChange(e)}
                style={{ width: width * 0.8 }}
              />
            </Grid>
            <Grid item>
              <TextField
                required
                id="outlined-required"
                label="Profile Picture"
                defaultValue={profilePicture}
                onChange={(e) => onProfilePictureChange(e)}
                style={{ width: width * 0.8 }}
              />
            </Grid>
            <br />
            <Grid item>
              <Button
                style={{
                  color: '#FFFFFF',
                  backgroundColor: green[500],
                  width: width * 0.8,
                  border: 1,
                  borderColor: grey[500],
                  borderRadius: 4,
                  height: '40px'
                }}
                onClick={handleOnSubmitClick}>
                Sign Up
              </Button>
            </Grid>
            <Grid item>
              <p align="center">
                If have already an account <a href="/login">click</a> to login!
              </p>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </div>
  );
}

export default SignUpUserDataPage;
