import React, { useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Grid, TextField, Button, Alert, AlertTitle, Typography, Modal } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import { BG_COLOR, PRIMARY_COLOR } from '../shared/constants';
import { signupNewUser } from '../queries/authentication-queries';
import { AuthUserContext } from '../authentication/AuthUserContext';
import { handleEmail } from '../queries/email-queries';
import ContentModal from '../components/common/ContentModal';

const modalBoxStyles = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  justifyConent: 'center',
  alignItems: 'center',
  borderRadius: 8
};

function SignUpPartnerDataPage() {
  const [isConfirmed, setIsConfirmed] = useState('No Request');
  const [partnerName, setPartnerName] = useState('');
  const [partnerGooglePlaceId, setPartnerGooglePlaceId] = useState('');
  const [partnerContactInfo, setPartnerContactInfo] = useState('');
  const [isInfoOpened, setIsInfoOpened] = useState(false);

  const authContext = useContext(AuthUserContext);
  const location = useLocation();
  const authData = location.state ? location.state.authData : null;

  const handleInfo = () => {
    setIsInfoOpened(true);
  };

  const handleSendPartnerRequest = async () => {
    try {
      const userData = {
        googlePlaceId: partnerGooglePlaceId,
        partnerLocationName: partnerName,
        partnerLocationContact: partnerContactInfo,
        confirmed: 'Requested'
      };
      if (!authData) {
        console.error(`authentication data is missing ${authData}`);
      }
      const signupData = { authData, userData };
      console.log('signupData: ', signupData);
      const message = await signupNewUser(signupData);
      const { success, token } = message;
      authContext.loginUser(token);
      if (success && token) {
        setIsConfirmed('Requested');
        handleEmail(
          {
            subject: 'Your Confirmation Request is Under Investigation!',
            to_name: authData.username, // auth.username
            to_email: authData.email, // auth.email ?
            intro_message: `Your sign up request is processing. We will get in touch with you as soon as possible.`
          },
          'general'
        );
      }
    } catch (e) {
      console.error(`failed to create user ${e}`);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: BG_COLOR
      }}>
      <ContentModal
        open={isConfirmed === 'No Request'}
        contentStyle={{
          display: 'flex',
          justifyConent: 'center',
          alignItems: 'center'
        }}
        contentRendered={
          <Box>
            <Grid
              container
              direction="column"
              alignItems="center"
              justifyContent="center"
              spacing={2}
              minWidth="60ch"
              style={{ margin: 6 }}>
              <Typography variant="h6" component="h2" color="text.secondary">
                Please Send Confirmation Request!
              </Typography>

              <Grid item style={{ minWidth: '50ch' }}>
                <TextField
                  id="standard-basic"
                  label="Please enter the Google Place ID of the location"
                  variant="standard"
                  value={partnerGooglePlaceId}
                  style={{ minWidth: '45ch' }}
                  onChange={(event) => setPartnerGooglePlaceId(event.target.value)}
                />
                <HelpIcon fontSize="medium" onClick={handleInfo} />
              </Grid>
              <Grid item style={{ minWidth: '50ch' }}>
                <TextField
                  id="standard-basic"
                  label="Please enter the name of your business"
                  variant="standard"
                  value={partnerName}
                  style={{ minWidth: '45ch' }}
                  onChange={(event) => setPartnerName(event.target.value)}
                />
              </Grid>
              <Grid item style={{ minWidth: '50ch' }}>
                <TextField
                  id="standard-basic"
                  label="Please enter a contact number."
                  variant="standard"
                  value={partnerContactInfo}
                  style={{ minWidth: '45ch' }}
                  onChange={(event) => setPartnerContactInfo(event.target.value)}
                />
              </Grid>
              <br />
              <Button
                style={{
                  color: '#FFFFFF',
                  backgroundColor: PRIMARY_COLOR,
                  width: '60%',
                  border: 1,
                  // borderColor: grey[500],
                  borderRadius: 4,
                  height: '40px'
                }}
                onClick={handleSendPartnerRequest}>
                Send Confirmation Request
              </Button>
            </Grid>
          </Box>
        }
      />

      <Modal
        open={isConfirmed === 'Requested'}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{
          display: 'flex',
          justifyConent: 'center',
          alignItems: 'center'
        }}>
        <Box sx={modalBoxStyles}>
          <div className="center">
            <Alert severity="info">
              <AlertTitle>Your request is processing!</AlertTitle>
              Your request is still under investigation. We will get in touch with you as soon as
              possible.
            </Alert>
          </div>
        </Box>
      </Modal>

      <ContentModal
        open={isInfoOpened}
        contentStyle={{
          display: 'flex',
          justifyConent: 'center',
          alignItems: 'center'
        }}
        contentRendered={
          <Box>
            <div className="center">
              <Alert
                severity="info"
                onClose={() => {
                  setIsInfoOpened(false);
                }}>
                <AlertTitle>Info</AlertTitle>
                You can find the Google Place Id of you business from{' '}
                <a href="https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder">
                  here
                </a>
              </Alert>
            </div>
          </Box>
        }
      />
    </div>
  );
}

export default SignUpPartnerDataPage;
