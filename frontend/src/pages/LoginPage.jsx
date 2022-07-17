import React, { useState, useContext } from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Typography, TextField, Button } from '@mui/material';
import { loginUser } from '../queries/user-queries';
import { AuthUserContext } from '../authentication/AuthUserContext';
import { loginPartnerLocation } from '../queries/partner-location-queries';

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

  const handleChange = (event, newLoginType) => {
    setPartnerType(newLoginType);
  };

  const navigate = useNavigate();

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
        height: '100vh'
      }}>
      <Box
        component="form"
        noValidate
        sx={{
          mt: 4,
          marginLeft: 5,
          marginRight: 5,
          marginBottom: 5,
          minWidth: 400
        }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100vh',
            margin: 5
          }}>
          <ToggleButtonGroup color="primary" value={partnerType} exclusive onChange={handleChange}>
            <ToggleButton value="user">User</ToggleButton>
            <ToggleButton value="restaurant">Restaurant</ToggleButton>
            <ToggleButton value="tourist-attraction">Tourist Attraction</ToggleButton>
          </ToggleButtonGroup>
        </div>

        <Grid container direction="column" justifyContent="center" alignItems="center" spacing={2}>
          <Grid item>
            <Typography align="center">Welcome to the Triplan!</Typography>
          </Grid>
          <Grid item>
            <TextField
              required
              id="outlined-required"
              label="Username"
              defaultValue={username}
              onChange={onUsernameChanged}
            />
          </Grid>
          <Grid item>
            <TextField
              required
              id="outlined-required"
              label="Password"
              defaultValue={password}
              onChange={onPasswordChanged}
            />
          </Grid>
          <Grid item>
            <Button onClick={partnerType === 'user' ? onSubmitClickedUser : onSubmitClickedPartner}>
              Login
            </Button>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default LoginPage;
