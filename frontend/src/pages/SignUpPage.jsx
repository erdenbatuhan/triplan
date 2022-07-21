import React, { useState, useContext } from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Typography, TextField, Button } from '@mui/material';
import { createNewUser } from '../queries/user-queries';
import { createNewPartnerLocation } from '../queries/partner-location-queries';
import { UserAuthHelper } from '../authentication/user-auth-helper';
import { AuthUserContext } from '../authentication/AuthUserContext';

function SignUpPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [partnerType, setPartnerType] = useState('user');
  const authContext = useContext(AuthUserContext);

  const handleChange = (event, newLoginType) => {
    setPartnerType(newLoginType);
  };

  const navigate = useNavigate();

  const onEmailChanged = (e) => {
    setEmail(e.target.value);
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
        password,
        email
      };
      const newUser = await createNewUser(userData);
      if (newUser) {
        navigate('/');
      }
    } catch (e) {
      console.error(`failed to create user ${e}`);
    }
  };
  const onSubmitClickedPartner = async () => {
    try {
      const partnerLocationData = {
        username,
        password,
        email,
        partnerType
      };
      const newPartnerLocation = await createNewPartnerLocation(partnerLocationData);
      const { token } = newPartnerLocation;
      authContext.loginUser(token);
      if (token) {
        const partnerData = UserAuthHelper.getDataFromToken(token);
        navigate(`/edit-partner-profile/${partnerData.partnerLocation.id}`, {
          state: { partnerType: partnerData.partnerLocation.partnerType }
        });
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
              fullWidth
              id="outlined-required"
              label="E-mail"
              defaultValue={email}
              onChange={(e) => onEmailChanged(e)}
            />
          </Grid>
          <Grid item>
            <TextField
              required
              id="outlined-required"
              label="Username"
              defaultValue={username}
              onChange={(e) => onUsernameChanged(e)}
            />
          </Grid>
          <Grid item>
            <TextField
              required
              id="outlined-required"
              label="Password"
              defaultValue={password}
              onChange={(e) => onPasswordChanged(e)}
            />
          </Grid>
          <Grid item>
            <Button onClick={partnerType === 'user' ? onSubmitClickedUser : onSubmitClickedPartner}>
              Sign Up
            </Button>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default SignUpPage;
