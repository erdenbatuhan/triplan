import * as React from 'react';
import { useState, useEffect, useRef } from 'react'; // useContext
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, TextField, Button } from '@mui/material';
import { grey } from '@mui/material/colors';
import {
  USER_TYPE_USER,
  USER_TYPE_RESTAURANT,
  USER_TYPE_TOURIST_ATTRACTION,
  BG_COLOR,
  PRIMARY_COLOR,
  WHITE
} from '../shared/constants';

const logo = require('../assets/triplan_logo.png');

function SignUpAuthPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState(USER_TYPE_USER);
  const ref = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    setWidth(ref.current.offsetWidth);
  }, []);

  const handleChange = (event, newLoginType) => {
    setUserType(newLoginType);
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

  const handleOnSubmitClick = async () => {
    try {
      const authData = { username, password, email, userType };
      switch (userType) {
        case USER_TYPE_USER:
          navigate('/signup-user-profile', { state: { authData } });
          break;
        case USER_TYPE_RESTAURANT: {
          navigate('/signup-partner-profile', { state: { authData } });
          break;
        }
        case USER_TYPE_TOURIST_ATTRACTION:
          navigate('/signup-partner-profile', { state: { authData } });
          break;
        default:
          console.error('Given user type is not known.');
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
          sx={{
            alignItems: 'center',
            justifyContent: 'center',
            border: 1,
            borderRadius: 4,
            backgroundColor: WHITE,
            borderColor: grey[500],
            padding: 4,
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

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 20
            }}>
            <ToggleButtonGroup
              ref={ref}
              color="primary"
              value={userType}
              exclusive
              onChange={handleChange}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
              <ToggleButton value="USER">User</ToggleButton>
              <ToggleButton value="RESTAURANT">Restaurant</ToggleButton>
              <ToggleButton value="TOURIST_ATTRACTION">Tourist Attraction</ToggleButton>
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
                style={{ width }}
              />
            </Grid>
            <Grid item>
              <TextField
                required
                id="outlined-required"
                label="Username"
                defaultValue={username}
                onChange={(e) => onUsernameChanged(e)}
                style={{ width }}
              />
            </Grid>
            <Grid item>
              <TextField
                required
                type="password"
                label="Password"
                defaultValue={password}
                onChange={(e) => onPasswordChanged(e)}
                style={{ width }}
              />
            </Grid>
            <br />
            <Grid item>
              <Button
                style={{
                  color: '#FFFFFF',
                  backgroundColor: PRIMARY_COLOR,
                  width: width * 0.6,
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

export default SignUpAuthPage;
