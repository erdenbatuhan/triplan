import React, { useEffect, useState } from 'react';
import {
  Grid,
  Stack,
  Typography,
  Avatar,
  IconButton,
  Divider,
  Card,
  CardContent,
  Box
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import TripCard from '../components/TripCard';
// import InfoCard from '../components/InfoCard';
import WalletPage from './WalletPage';
import { UserAuthHelper } from '../authentication/user-auth-helper';
import { getUserFollowers, getUserFollowed } from '../queries/following-relationship-queries';
import { getTripPlansOfUser } from '../queries/trip-plan-queries';

const mockImgData = {
  img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
  title: 'Sea star'
};
function UserProfilePage() {
  const [authenticatedUser] = useState(UserAuthHelper.getStoredUser());
  const [username, setUsername] = useState('');
  const [followers, setFollowers] = useState([]);
  const [followed, setFollowed] = useState([]);
  const [trips, setTrips] = useState([]);

  // Listen to the changes in authenticatedUser, trips, followers and followed
  useEffect(() => {
    if (!authenticatedUser) {
      return;
    }
    getUserFollowers(authenticatedUser.user.id).then((data) => setFollowers(data));
    getUserFollowed(authenticatedUser.user.id).then((data) => setFollowed(data));
    setUsername(authenticatedUser.user.username);
    getTripPlansOfUser(authenticatedUser.user.id).then((data) => setTrips(data));
  }, [authenticatedUser, followers, followed, trips]);

  return (
    <Grid container spacing={2} m={5}>
      <Grid item xs={3}>
        <Grid container direction="column" justifyContent="center" alignItems="center">
          <Grid item xs={6}>
            <Avatar
              sx={{ width: '100%', height: '100%' }}
              src={`${mockImgData.img}?w=164&h=164&fit=crop&auto=format`}
              srcSet={`${mockImgData.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
              alt={mockImgData.title}
              loading="lazy"
            />
          </Grid>

          <Grid item xs={3}>
            <Typography align="center" m={1} sx={{ fontWeight: 'bold', fontSize: 'h6.fontSize' }}>
              {username}
            </Typography>
          </Grid>

          <Grid item xs={3}>
            <Typography align="center">
              <IconButton sx={{ p: 0, display: 'inline' }}>
                <LocationOnIcon fontSize="small" sx={{ color: '#f44336', fontStyle: 'italic' }} />
              </IconButton>

              <Typography sx={{ display: 'inline' }}>Berlin</Typography>
            </Typography>
          </Grid>

          <Grid item xs={9} m={4}>
            <WalletPage />
          </Grid>

          <Grid item xs={9} m={2}>
            <Card
              sx={{
                width: '100%',
                textAlign: 'center',
                height: '100%',
                boxShadow: 4
              }}>
              <CardContent>
                <Grid container>
                  <Grid item sx={4} alignItems="center">
                    <Box
                      sx={{
                        p: 2
                      }}>
                      <Box sx={{ color: 'text.secondary' }}> Followers </Box>

                      <Box sx={{ color: 'text.primary', fontSize: 34, fontWeight: 'medium' }}>
                        {followers.length}
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item sx={4}>
                    <Divider orientation="vertical" sx={{ fontWeight: 'bold' }} />
                  </Grid>

                  <Grid item sx={4} alignItems="center">
                    <Box
                      sx={{
                        p: 2
                      }}>
                      <Box sx={{ color: 'text.secondary' }}> Following </Box>

                      <Box sx={{ color: 'text.primary', fontSize: 34, fontWeight: 'medium' }}>
                        {followed.length}
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={1} />

      <Grid item xs={6}>
        <Grid>
          <Typography align="left" variant="h6" color="text.secondary">
            Trips: {trips.length}
          </Typography>
          <Divider />
        </Grid>
        <Grid container direction="column" justifyContent="center" alignItems="center" spacing={4}>
          <Grid item xs={9} sx={{ width: '100%' }}>
            <Stack spacing={2} pt={4}>
              {trips.map((trip) => {
                return (
                  <TripCard
                    key={trip.id}
                    name={trip.name}
                    // isRated={tripData.isRated}
                    // href={tripData.href}
                  />
                );
              })}
            </Stack>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={2} />
    </Grid>
  );
}

export default UserProfilePage;
