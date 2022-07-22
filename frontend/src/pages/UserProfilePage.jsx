import React from 'react';
import {
  Grid,
  Stack,
  Typography,
  Avatar,
  IconButton,
  Divider,
  Card,
  CardContent
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import TripCard from '../components/TripCard';
// import InfoCard from '../components/InfoCard';
import WalletPage from './WalletPage';

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

/* const mockProfileInfoCardData = [
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
]; */

const mockImgData = {
  img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
  title: 'Sea star'
};
function UserProfilePage() {
  // const [userData, setUserData] = useState([]);

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
              Jane Doe
            </Typography>
          </Grid>

          <Grid item xs={3}>
            <Typography align="center">
              <IconButton>
                <LocationOnIcon fontSize="small" sx={{ color: '#f44336', fontStyle: 'italic' }} />
              </IconButton>
              Berlin
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
                p: 2,
                boxShadow: 4
              }}>
              <CardContent>
                <Grid container>
                  <Grid item sx={4} alignItems="center">
                    <Typography variant="h6" color="text.secondary">
                      Followers
                    </Typography>
                  </Grid>

                  <Grid item sx={4}>
                    <Divider orientation="vertical" sx={{ ontWeight: 'bold', pl: 2 }} />
                  </Grid>

                  <Grid item sx={4} alignItems="center">
                    <Typography variant="h6" color="text.secondary" sx={{ pl: 2 }}>
                      Following
                    </Typography>
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
            Trips:
          </Typography>
          <Divider />
        </Grid>
        <Grid container direction="column" justifyContent="center" alignItems="center" spacing={4}>
          {/* <Stack direction="row" spacing={12}>
            {mockProfileInfoCardData.map((infoData) => (
              <Grid item key={infoData.id}>
                <InfoCard
                  key={infoData.id}
                  title={infoData.title}
                  value={infoData.value}
                  href={infoData.href}
                />
              </Grid>
            ))}
            </Stack> */}
          <Grid item xs={9} sx={{ width: '100%' }}>
            <Stack spacing={2} pt={4}>
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
      <Grid item xs={2} />
    </Grid>
  );

  /* return (
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
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={4}>
            <Grid item xs={3}>
              <Stack direction="row" spacing={12}>
                {mockProfileInfoCardData.map((infoData) => (
                  <Grid item key={infoData.id}>
                    <InfoCard
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
    </Box>
  ); */
}

export default UserProfilePage;
