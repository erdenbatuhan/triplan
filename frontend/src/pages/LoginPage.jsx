import React from 'react';
import { Box, Grid, Typography, TextField, Button } from '@mui/material';

function LoginPage() {
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
          <TextField required id="outlined-required" label="Username" defaultValue="" />
        </Grid>
        <Grid item xs={4}>
          <TextField required id="outlined-required" label="Password" defaultValue="" />
        </Grid>
        <Grid item xs={4}>
          <Button href="/">Login</Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default LoginPage;
