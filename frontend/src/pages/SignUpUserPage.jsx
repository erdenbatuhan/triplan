import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Grid, TextField, Button } from '@mui/material';
import { grey } from '@mui/material/colors';
import { PRIMARY_COLOR, BG_COLOR } from '../shared/constants';
import { signupNewUser } from '../queries/authentication-queries';
import { AuthUserContext } from '../authentication/AuthUserContext';

const logo = require('../assets/triplan_logo.png');

function SignUpUserDataPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  // const [profilePicture, setProfilePicture] = useState('');

  const authContext = useContext(AuthUserContext);
  const navigate = useNavigate();
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
  // const onProfilePictureChange = (e) => {
  //   setProfilePicture(e.target.value);
  // };

  const handleOnSubmitClick = async () => {
    try {
      const userData = { firstName, lastName, phoneNumber };
      if (!authData) {
        console.error(`authentication data is missing ${authData}`);
      }
      const signupData = { authData, userData };
      const message = await signupNewUser(signupData);
      const { success, token } = message;
      authContext.loginUser(token);
      if (success && token) {
        navigate('/', {
          state: {
            isLoggedIn: true
          }
        });
      }
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
        backgroundColor: BG_COLOR
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
            padding: 5,
            minWidth: '25vw'
          }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
            <img src={logo} alt={logo} style={{ width: 75, height: 75, borderRadius: 20 }} />
          </div>
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
            {/* <Grid item>
              <TextField
                required
                id="outlined-required"
                label="Profile Picture"
                defaultValue={profilePicture}
                onChange={(e) => onProfilePictureChange(e)}
                style={{ width: width * 0.8 }}
              />
            </Grid> */}
            <br />
            <Grid item>
              <Button
                style={{
                  color: '#FFFFFF',
                  backgroundColor: PRIMARY_COLOR,
                  width: width * 0.5,
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
