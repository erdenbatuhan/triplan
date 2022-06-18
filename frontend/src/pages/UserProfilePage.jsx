import React from 'react';
import { Grid, Stack } from '@mui/material';
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

function UserProfilePage() {
  // const [userData, setUserData] = useState([]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={3}>
        <div>img</div>
        <div>
          <div>Jane Doe</div>
          <div>Berlin</div>
        </div>
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
