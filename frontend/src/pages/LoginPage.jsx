import React, { useState } from 'react';
import { Box, Grid, Typography, TextField, Button } from '@mui/material';
// import { findUserByUsername } from '../queries/user-queries';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onUsernameChanged = (e) => {
    setUsername(e.target.value);
  };

  const onPasswordChanged = (e) => {
    setPassword(e.target.value);
  };

  const onSubmitClicked = async () => {
    try {
      const userData = {
        username,
        password
      };
      // await findUserByUsername(userData);
      console.log('userData: ', userData);
    } catch (e) {
      console.error(`failed to find user ${username}`);
    }
  };

  return (
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
          <Button href="/" onClick={onSubmitClicked}>
            Login
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default LoginPage;
