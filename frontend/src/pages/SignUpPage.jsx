import React from 'react';
import { Box, Grid, Typography, TextField, Button } from '@mui/material';

function SignUpPage() {
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
          <Grid container direction="row" justifyContent="center" alignItems="center" spacing={2}>
            <Grid item xs={4}>
              <TextField required id="outlined-required" label="First Name" defaultValue="" />
            </Grid>
            <Grid item xs={4}>
              <TextField required id="outlined-required" label="Last Name" defaultValue="" />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <TextField required fullWidth id="outlined-required" label="E-mail" defaultValue="" />
        </Grid>
        <Grid item xs={4}>
          <Grid container direction="row" justifyContent="center" alignItems="center" spacing={2}>
            <Grid item xs={4}>
              <TextField required id="outlined-required" label="Username" defaultValue="" />
            </Grid>
            <Grid item xs={4}>
              <TextField required id="outlined-required" label="Password" defaultValue="" />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <TextField required id="outlined-required" label="Phone Number" defaultValue="" />
        </Grid>
        <Grid item xs={4}>
          <TextField required id="outlined-required" label="Gender" defaultValue="" />
        </Grid>
        <Grid item xs={4}>
          <TextField required id="outlined-required" label="Date of Birth" defaultValue="" />
        </Grid>
        <Grid item xs={4}>
          <TextField required id="outlined-required" label="Nationality" defaultValue="" />
        </Grid>
        <Grid item xs={4}>
          <TextField required id="outlined-required" label="Profile Picture" defaultValue="" />
        </Grid>
        <Grid item xs={4}>
          <Button href="/">Sign In</Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default SignUpPage;
