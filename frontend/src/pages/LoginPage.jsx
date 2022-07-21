import React, { useState, useContext, useRef, useEffect } from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, TextField, Button } from '@mui/material';
import { green, grey } from '@mui/material/colors';
import { loginUser } from '../queries/user-queries';
import { AuthUserContext } from '../authentication/AuthUserContext';
import { loginPartnerLocation } from '../queries/partner-location-queries';
import { SECONDARY_COLOR } from '../shared/constants';

// const logo = require('../assets/triplan_logo.png');

function getDataFromToken(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  const payload = atob(base64);
  const partnerData = JSON.parse(payload);
  return partnerData;
}

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [partnerType, setPartnerType] = useState('user');
  const authContext = useContext(AuthUserContext);
  const ref = useRef(null);
  const navigate = useNavigate();

  // const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    // setHeight(ref.current.offsetHeight);
    setWidth(ref.current.offsetWidth);
  }, []);

  const handleChange = (event, newLoginType) => {
    setPartnerType(newLoginType);
  };

  const onUsernameChanged = (e) => {
    setUsername(e.target.value);
  };

  const onPasswordChanged = (e) => {
    setPassword(e.target.value);
  };

  const onSubmitClickedUser = async () => {
    try {
      const userData = {
        username,
        password
      };
      const message = await loginUser(userData);
      const { token } = message;
      authContext.loginUser(token);
      if (token) {
        navigate('/');
      }
    } catch (e) {
      console.error(`failed to find user ${username}`);
    }
  };

  const onSubmitClickedPartner = async () => {
    try {
      const partnerLocationData = {
        username,
        password,
        partnerType
      };
      const message = await loginPartnerLocation(partnerLocationData);
      const { token } = message;
      authContext.loginUser(token);
      if (token) {
        const partnerData = getDataFromToken(token);
        navigate(`/restaurant-profile/${partnerData.partnerLocation.id}`);
      }
    } catch (e) {
      console.error(`failed to create partner location ${e}`);
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
            }}>
            <ToggleButtonGroup
              color="primary"
              value={partnerType}
              exclusive
              onChange={handleChange}>
              <ToggleButton value="user">User</ToggleButton>
              <ToggleButton value="restaurant">Restaurant</ToggleButton>
              <ToggleButton value="tourist-attraction">Tourist Attraction</ToggleButton>
            </ToggleButtonGroup>
          </div>

          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={1}>
            <br />
            <Grid item>
              <TextField
                required
                id="outlined-required"
                label="Username"
                defaultValue={username}
                onChange={onUsernameChanged}
                style={{ width: width * 0.8 }}
              />
            </Grid>
            <Grid item>
              <TextField
                required
                id="outlined-required"
                label="Password"
                defaultValue={password}
                onChange={onPasswordChanged}
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
                onClick={partnerType === 'user' ? onSubmitClickedUser : onSubmitClickedPartner}>
                Login
              </Button>
            </Grid>
            <Grid item>
              <p align="center">
                If you havent registered yet to <a href="/signup">click</a> to signup!
              </p>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </div>
  );
}

export default LoginPage;
