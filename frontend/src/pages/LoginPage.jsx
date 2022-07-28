import React, { useState, useContext, useRef, useEffect } from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, TextField, Button } from '@mui/material';
import { grey } from '@mui/material/colors';
import { loginUser } from '../queries/authentication-queries';
import { AuthUserContext } from '../authentication/AuthUserContext';
import { USER_TYPE_USER, BG_COLOR, WHITE, PRIMARY_COLOR } from '../shared/constants';

const logo = require('../assets/triplan_logo.png');

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState(USER_TYPE_USER);
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
    setUserType(newLoginType);
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
        userType
      };
      const message = await loginUser(userData);
      const { token } = message;
      authContext.loginUser(token);
      if (token) {
        navigate('/', {
          state: {
            isLoggedIn: true
          }
        });
      }
    } catch (e) {
      console.error(`failed to find user ${username}`);
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
            borderColor: grey[500],
            backgroundColor: WHITE,
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
              onChange={handleChange}>
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
            spacing={1}>
            <br />
            <Grid item>
              <TextField
                required
                id="outlined-required"
                label="Username"
                defaultValue={username}
                onChange={onUsernameChanged}
                style={{ width }}
              />
            </Grid>
            <Grid item>
              <TextField
                required
                id="outlined-required"
                label="Password"
                defaultValue={password}
                onChange={onPasswordChanged}
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
                onClick={onSubmitClickedUser}>
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
