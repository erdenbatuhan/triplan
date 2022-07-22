import React, { useState, useEffect, useRef, useContext } from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, TextField, Button } from '@mui/material';
import { green, grey } from '@mui/material/colors';
import { createNewUser } from '../queries/user-queries';
import { createNewPartnerLocation } from '../queries/partner-location-queries';
import { SECONDARY_COLOR } from '../shared/constants';
import { UserAuthHelper } from '../authentication/user-auth-helper';
import { AuthUserContext } from '../authentication/AuthUserContext';

function SignUpPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [partnerType, setPartnerType] = useState('user');
  const ref = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    setWidth(ref.current.offsetWidth);
  }, []);
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
            spacing={2}>
            <br />
            <Grid item>
              <TextField
                required
                fullWidth
                id="outlined-required"
                label="E-mail"
                defaultValue={email}
                onChange={(e) => onEmailChanged(e)}
                style={{ width: width * 0.8 }}
              />
            </Grid>
            <Grid item>
              <TextField
                required
                id="outlined-required"
                label="Username"
                defaultValue={username}
                onChange={(e) => onUsernameChanged(e)}
                style={{ width: width * 0.8 }}
              />
            </Grid>
            <Grid item>
              <TextField
                required
                id="outlined-required"
                label="Password"
                defaultValue={password}
                onChange={(e) => onPasswordChanged(e)}
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

export default SignUpPage;
