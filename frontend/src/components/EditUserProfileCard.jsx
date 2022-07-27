import React from 'react';
import { Box, Grid, Typography, TextField, Button, Avatar, Link } from '@mui/material';

export default function EditUserProfileCard({ user }) {
  return (
    <Box component="form" sx={{ width: '100%' }} alignItems="stretch" justifyContent="center">
      <Grid container direction="column" justifyContent="center" alignItems="center" spacing={2}>
        <Grid item>
          <Typography
            sx={{ color: 'text.secondary', fontWeight: 'medium', fontSize: 25, pt: 2 }}
            align="center">
            Edit Profile
          </Typography>
        </Grid>
        <Grid item>
          <Grid container direction="row" justifyContent="center" alignItems="center" spacing={2}>
            <Grid item>
              <Avatar
                sx={{ width: '75px', height: '75px' }}
                src={user.profilePicture}
                loading="lazy"
              />
            </Grid>
            <Grid item>
              <Button> Upload Photo </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <TextField
            fullWidth
            required
            id="outlined-required"
            label="name"
            // value={partnerName}
            // onChange={(e) => onPartnerNameChange(e)}
          />
        </Grid>
        <Grid item>
          <TextField
            fullWidth
            required
            id="outlined-required"
            label="surname"
            // value={partnerPhoneNumber}
            // onChange={(e) => onPartnerPhoneNumberChange(e)}
          />
        </Grid>
        <Grid item>
          <TextField
            required
            fullWidth
            id="outlined-required"
            label="username"
            // value={partnerAddress}
            // onChange={(e) => onPartnerAddressChange(e)}
          />
        </Grid>
        <Grid item>
          <Link href="/"> Change your password </Link>
        </Grid>
        <Grid item>
          <Button> Save </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
