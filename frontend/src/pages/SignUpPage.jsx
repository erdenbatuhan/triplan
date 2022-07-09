import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Typography, TextField, Button } from '@mui/material';
import { createNewUser } from '../queries/user-queries';

function SignUpPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // const [phoneNumber, setPhoneNumber] = useState('');
  // const [gender, setGender] = useState('');
  // const [dateOfBirth, setDateOfBirth] = useState('');
  // const [nationality, setNationality] = useState('');
  const [profilePicture, setProfilePicture] = useState('');

  const navigate = useNavigate();

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
  // const onPhoneNumberChanged = (e) => {
  //   setPhoneNumber(e.target.value);
  // };
  // const onGenderChanged = (e) => {
  //   setGender(e.target.value);
  // };
  // const onDateOfBirthChanged = (e) => {
  //   setDateOfBirth(e.target.value);
  // };
  // const onNationalityChanged = (e) => {
  //   setNationality(e.target.value);
  // };
  const onProfilePictureChanged = (e) => {
    setProfilePicture(e.target.value);
  };

  const onSubmitClicked = async () => {
    try {
      const userData = {
        username,
        password,
        firstName,
        lastName,
        // phoneNumber,
        email
        // gender,
        // dateOfBirth,
        // nationality,
        // profilePicture
      };
      const newUser = await createNewUser(userData);
      if (newUser) {
        navigate('/');
      }
    } catch (e) {
      console.error(`failed to create user ${e}`);
    }
  };

  return (
    <Box
      component="form"
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
          <Grid container direction="row" justifyContent="center" alignItems="center" spacing={2}>
            <Grid item>
              <TextField
                required
                id="outlined-required"
                label="First Name"
                defaultValue={firstName}
                onChange={(e) => onFirstNameChanged(e)}
              />
            </Grid>
            <Grid item>
              <TextField
                required
                id="outlined-required"
                label="Last Name"
                defaultValue={lastName}
                onChange={(e) => onLastNameChanged(e)}
              />
            </Grid>
          </Grid>
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
          <Grid container direction="row" justifyContent="center" alignItems="center" spacing={2}>
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
          </Grid>
        </Grid>
        {/* <Grid item>
          <TextField
            required
            id="outlined-required"
            label="Phone Number"
            defaultValue={phoneNumber}
            onChange={(e) => onPhoneNumberChanged(e)}
          />
        </Grid> */}
        {/* <Grid item>
          <TextField
            required
            id="outlined-required"
            label="Gender"
            defaultValue={gender}
            onChange={(e) => onGenderChanged(e)}
          />
        </Grid>
        <Grid item>
          <TextField
            required
            id="outlined-required"
            label="Date of Birth"
            defaultValue={dateOfBirth}
            onChange={(e) => onDateOfBirthChanged(e)}
          />
        </Grid>
        <Grid item>
          <TextField
            required
            id="outlined-required"
            label="Nationality"
            defaultValue={nationality}
            onChange={(e) => onNationalityChanged(e)}
          />
        </Grid> */}
        <Grid item>
          <TextField
            required
            id="outlined-required"
            label="Profile Picture"
            defaultValue={profilePicture}
            onChange={(e) => onProfilePictureChanged(e)}
          />
        </Grid>
        <Grid item>
          <Button onClick={onSubmitClicked}>Sign In</Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default SignUpPage;
