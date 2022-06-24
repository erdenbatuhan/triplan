import React, { useState } from 'react';
import { Box, Grid, Typography, TextField, Button } from '@mui/material';

function SignUpPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [nationality, setNationality] = useState('');
  const [profilePicture, setProfilePicture] = useState('');

  const onFirstNameChanged = (e) => {
    setFirstName(e.target.value);
  };
  const onLastNameChanged = (e) => {
    setLastName(e.target.value);
  };
  const onEmailChanged = (e) => {
    setEmail(e.target.value);
  };
  const onUsernameChanged = (e) => {
    setUsername(e.target.value);
  };
  const onPasswordChanged = (e) => {
    setPassword(e.target.value);
  };
  const onPhoneNumberChanged = (e) => {
    setPhoneNumber(e.target.value);
  };
  const onGenderChanged = (e) => {
    setGender(e.target.value);
  };
  const onDateOfBirthChanged = (e) => {
    setDateOfBirth(e.target.value);
  };
  const onNationalityChanged = (e) => {
    setNationality(e.target.value);
  };
  const onProfilePictureChanged = (e) => {
    setProfilePicture(e.target.value);
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
          <Grid container direction="row" justifyContent="center" alignItems="center" spacing={2}>
            <Grid item xs={4}>
              <TextField
                required
                id="outlined-required"
                label="First Name"
                defaultValue={firstName}
                onChange={onFirstNameChanged}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                required
                id="outlined-required"
                label="Last Name"
                defaultValue={lastName}
                onChange={onLastNameChanged}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <TextField
            required
            fullWidth
            id="outlined-required"
            label="E-mail"
            defaultValue={email}
            onChange={onEmailChanged}
          />
        </Grid>
        <Grid item xs={4}>
          <Grid container direction="row" justifyContent="center" alignItems="center" spacing={2}>
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
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <TextField
            required
            id="outlined-required"
            label="Phone Number"
            defaultValue={phoneNumber}
            onChange={onPhoneNumberChanged}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            required
            id="outlined-required"
            label="Gender"
            defaultValue={gender}
            onChange={onGenderChanged}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            required
            id="outlined-required"
            label="Date of Birth"
            defaultValue={dateOfBirth}
            onChange={onDateOfBirthChanged}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            required
            id="outlined-required"
            label="Nationality"
            defaultValue={nationality}
            onChange={onNationalityChanged}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            required
            id="outlined-required"
            label="Profile Picture"
            defaultValue={profilePicture}
            onChange={onProfilePictureChanged}
          />
        </Grid>
        <Grid item xs={4}>
          <Button href="/">Sign In</Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default SignUpPage;
