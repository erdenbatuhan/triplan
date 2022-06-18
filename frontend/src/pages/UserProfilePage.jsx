import React from 'react';
import { Grid, Stack, Typography } from '@mui/material';
import TripCard from '../components/TripCard';
import ProfileInfoCard from '../components/ProfileInfoCard';

const mockTripCardData = [
  {
    id: '0',
    tripName: 'Munich',
    isRated: true,
    href: '/'
  },
  {
    id: '1',
    tripName: 'Berlin',
    isRated: false,
    href: '/'
  }
];

const mockProfileInfoCardData = [
  {
    id: '0',
    title: 'Trips',
    value: '3',
    href: '/'
  },
  {
    id: '1',
    title: 'Followers',
    value: '10',
    href: '/'
  },
  {
    id: '2',
    title: 'Following',
    value: '17',
    href: '/'
  }
];

const mockImgData = {
  img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
  title: 'Sea star'
};
function UserProfilePage() {
  // const [userData, setUserData] = useState([]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={3}>
        <Grid container direction="column" justifyContent="center" alignItems="center">
          <Grid item xs={6}>
            <img
              src={`${mockImgData.img}?w=164&h=164&fit=crop&auto=format`}
              srcSet={`${mockImgData.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
              alt={mockImgData.title}
              loading="lazy"
            />
          </Grid>
          <Grid item xs={3}>
            <Typography align="center">Jane Doe</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography align="center">Berlin</Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={9}>
        <Grid container direction="column" justifyContent="center" alignItems="center" spacing={4}>
          <Grid item xs={3}>
            <Stack direction="row" spacing={12}>
              {mockProfileInfoCardData.map((infoData) => (
                <Grid item key={infoData.id}>
                  <ProfileInfoCard
                    key={infoData.id}
                    title={infoData.title}
                    value={infoData.value}
                    href={infoData.href}
                  />
                </Grid>
              ))}
            </Stack>
          </Grid>
          <Grid item xs={9}>
            <Stack spacing={2}>
              {mockTripCardData.map((tripData) => {
                return (
                  <TripCard
                    key={tripData.id}
                    tripName={tripData.tripName}
                    isRated={tripData.isRated}
                    href={tripData.href}
                  />
                );
              })}
            </Stack>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default UserProfilePage;
