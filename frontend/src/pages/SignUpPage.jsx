import React, { useState } from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Typography, TextField, Button } from '@mui/material';
import { createNewUser } from '../queries/user-queries';
import { createNewPartnerLocation } from '../queries/partner-location-queries';

function SignUpPage() {
  // const [firstName, setFirstName] = useState('');
  // const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [partnerType, setPartnerType] = useState('user');

  const handleChange = (event, newLoginType) => {
    setPartnerType(newLoginType);
  };

  // const [phoneNumber, setPhoneNumber] = useState('');
  // const [gender, setGender] = useState('');
  // const [dateOfBirth, setDateOfBirth] = useState('');
  // const [nationality, setNationality] = useState('');
  // const [profilePicture, setProfilePicture] = useState('');

  const navigate = useNavigate();

  // const onFirstNameChanged = (e) => {
  //   setFirstName(e.target.value);
  // };
  // const onLastNameChanged = (e) => {
  //   setLastName(e.target.value);
  // };
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
        // firstName,
        // lastName,
        // phoneNumber,
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
      if (newPartnerLocation) {
        // console.log(newPartnerLocation);
        navigate('/');
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
        height: '100vh'
      }}>
      <Box
        component="form"
        sx={{
          mt: 4,
          marginLeft: 5,
          marginRight: 5,
          marginBottom: 5,
          minWidth: 400
        }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100vh',
            margin: 5
          }}>
          <ToggleButtonGroup color="primary" value={partnerType} exclusive onChange={handleChange}>
            <ToggleButton value="user">User</ToggleButton>
            <ToggleButton value="restaurant">Restaurant</ToggleButton>
            <ToggleButton value="tourist-attraction">Tourist Attraction</ToggleButton>
          </ToggleButtonGroup>
        </div>
        <Grid container direction="column" justifyContent="center" alignItems="center" spacing={2}>
          <Grid item>
            <Typography align="center">Welcome to the Triplan!</Typography>
          </Grid>
          {/* <Grid item>
            <Grid container direction="row" justifyContent="center" alignItems="center" spacing={2}>
              <Grid item>
                <TextField
                  required
                  id="outlined-required"
                  label={loginType === 'user-tab' ? 'First Name' : 'Partner Name'}
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
          </Grid> */}
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

          {/* <Grid item>
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
          </Grid> */}

          {/* <Grid item>
            <TextField
              required
              id="outlined-required"
              label="Profile Picture"
              defaultValue={profilePicture}
              onChange={(e) => onProfilePictureChanged(e)}
            />
          </Grid> */}
          <Grid item>
            <Button onClick={partnerType === 'user' ? onSubmitClickedUser : onSubmitClickedPartner}>
              Sign Up
            </Button>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default SignUpPage;
