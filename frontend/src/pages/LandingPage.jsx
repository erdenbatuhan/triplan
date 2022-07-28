import { Typography, Grid, Box, Button } from '@mui/material';
import '../App.css';
import Fab from '@mui/material/Fab';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import landingBg from '../assets/landing-page-background.png';
// import LandingPageBar from '../components/landingPage/NavigationBarLandingPage';
import { SECONDARY_COLOR } from '../shared/constants';
import AboutUs from '../components/landingPage/AboutUs';
import WhyTriplan from '../components/landingPage/WhyTriplan';
import ContactUs from '../components/landingPage/ContactUs';

function LandingPage() {
  const handleMainScroll = () => {
    const anchor = document.querySelector('#main');
    anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div>
      <div
        id="main"
        style={{
          backgroundImage: `url(${landingBg})`,
          backgroundSize: 'cover',
          height: '100vh'
        }}>
        <div
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            position: 'absolute',
            boxSizing: 'border-box',
            width: '100%',
            height: '100%'
          }}>
          <div
            style={{
              position: 'absolute',
              left: '10%',
              top: '20%',
              boxSizing: 'border-box',
              width: '80%',
              height: '80%'
            }}>
            <Grid container direction="row">
              <Grid item xs={6}>
                <Grid container direction="column">
                  <Typography
                    gutterBottom
                    variant="h2"
                    color="white"
                    sx={{
                      fontFamily: 'sans-serif',
                      fontWeight: 'bold'
                    }}>
                    Create Your Dream Trip in a Few Minutes
                  </Typography>
                  <br />
                  <Typography
                    gutterBottom
                    variant="body4"
                    color="white"
                    sx={{
                      fontFamily: 'sans-serif',
                      fontWeight: 'medium',
                      fontSize: 22,
                      textAlign: 'justify'
                    }}>
                    Triplan is a smart travel planning platform to help travelers avoid the stress
                    and hassle of trip planning by not only saving them time, but also getting them
                    great discounts and the opportunity to visit the places liked by the people they
                    follow with the help of its optimized route planning algorithms built onto a
                    user-friendly interface.
                  </Typography>
                  <br />
                  <br />
                  <Box textAlign="center">
                    <Grid container direction="row" spacing={4}>
                      <Grid item xs={2} />

                      <Grid item xs={4}>
                        <Button
                          sx={{
                            width: '100%',
                            height: '60px'
                          }}
                          variant="contained"
                          color="primary">
                          Explore World!
                        </Button>
                      </Grid>

                      <Grid item xs={4}>
                        <Button
                          sx={{
                            width: '100%',
                            height: '60px'
                          }}
                          variant="contained"
                          color="success">
                          Be Our Partner!
                        </Button>
                      </Grid>

                      <Grid item xs={2} />
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
      <div
        style={{
          backgroundColor: SECONDARY_COLOR,
          backgroundSize: 'cover',
          height: '100vh'
        }}
        id="team">
        <div
          style={{
            position: 'absolute',
            boxSizing: 'border-box',
            width: '100%',
            height: '100%'
          }}>
          <AboutUs />
        </div>
      </div>
      <div
        style={{
          backgroundColor: SECONDARY_COLOR,
          backgroundSize: 'cover',
          height: '100vh'
        }}
        id="whyTriplan">
        <div
          style={{
            position: 'absolute',
            boxSizing: 'border-box',
            width: '100%',
            height: '100%'
          }}>
          <WhyTriplan />
        </div>
      </div>
      <div
        style={{
          backgroundColor: SECONDARY_COLOR,
          backgroundSize: 'cover',
          height: '100vh'
        }}
        id="contact">
        <div
          style={{
            position: 'absolute',
            boxSizing: 'border-box',
            width: '100%',
            height: '100%'
          }}>
          <ContactUs />
        </div>
      </div>
      <Fab
        variant="circular"
        style={{ position: 'fixed', bottom: 16, right: 16 }}
        color="primary"
        onClick={handleMainScroll}>
        <ArrowUpwardIcon />
      </Fab>
    </div>
  );
}

export default LandingPage;
