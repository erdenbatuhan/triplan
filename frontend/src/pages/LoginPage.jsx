import React, { useState } from 'react';
import { Box, Grid, Typography, TextField, Button } from '@mui/material';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onUsernameChanged = (e) => {
    setUsername(e.target.value);
  };

  const onPasswordChanged = (e) => {
    setPassword(e.target.value);
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
        <Grid item xs={4}>
          <Typography align="center">Welcome to the Triplanner!</Typography>
        </Grid>
        <Grid item xs={4}>
          <TextField
            required
            id="outlined-required"
            label="Username"
            defaultValue={username}
            onChange={onUsernameChanged}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            required
            id="outlined-required"
            label="Password"
            defaultValue={password}
            onChange={onPasswordChanged}
          />
        </Grid>
        <Grid item xs={4}>
          <Button href="/">Login</Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default LoginPage;
