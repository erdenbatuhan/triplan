import React, { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, TextField, Button } from '@mui/material';
import { grey } from '@mui/material/colors';
import { AuthUserContext } from '../authentication/AuthUserContext';
import { BG_COLOR, PRIMARY_COLOR, WHITE } from '../shared/constants';
import { loginAdmin } from '../queries/admin-queries';
// const logo = require('../assets/triplan_logo.png');

function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const authContext = useContext(AuthUserContext);
  const ref = useRef(null);
  const navigate = useNavigate();

  // const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    // setHeight(ref.current.offsetHeight);
    setWidth(ref.current.offsetWidth);
  }, []);

  const onUsernameChanged = (e) => {
    setUsername(e.target.value);
  };

  const onPasswordChanged = (e) => {
    setPassword(e.target.value);
  };

  const onSubmitClickedAdmin = async () => {
    try {
      const adminData = {
        username,
        password
      };
      const message = await loginAdmin(adminData);
      const { token } = message;
      authContext.loginUser(token);
      if (token) {
        navigate('/admin');
      }
    } catch (e) {
      console.error(`failed to find user ${e}`);
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
        ref={ref}
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
          border: 1,
          borderRadius: 4,
          borderColor: grey[500],
          backgroundColor: WHITE,
          padding: 5,
          minWidth: '25vw'
        }}>
        <Grid container direction="column" justifyContent="center" alignItems="center" spacing={1}>
          <p align="center">ADMIN LOGIN</p>
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
              type="password"
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
                backgroundColor: PRIMARY_COLOR,
                width: width * 0.4,
                border: 1,
                borderColor: grey[500],
                borderRadius: 4,
                height: '40px'
              }}
              onClick={onSubmitClickedAdmin}>
              Login
            </Button>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default AdminLoginPage;
