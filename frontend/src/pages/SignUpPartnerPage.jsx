import React, { useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Grid, TextField, Button, Alert, AlertTitle, Typography, Modal } from '@mui/material';
import { green } from '@mui/material/colors';
import { SECONDARY_COLOR } from '../shared/constants';
import { signupNewUser } from '../queries/authentication-queries';
import { AuthUserContext } from '../authentication/AuthUserContext';
// import { UserAuthHelper } from '../authentication/user-auth-helper';
import { modalStyle } from '../shared/styles';
// import { createNewPartnerSignupRequest } from '../queries/partner-signup-request-queries';
import { handleEmail } from '../queries/email-queries';

const style = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

function SignUpPartnerDataPage() {
  // const [partnerName, setPartnerName] = useState('');
  // const [partnerDescription, setPartnerDescription] = useState('');
  // const [partnerCity, setPartnerCity] = useState('');
  // const [partnerCountry, setPartnerCountry] = useState('');
  // const [partnerAddress, setPartnerAddress] = useState('');
  // const [partnerPhoneNumber, setPartnerPhoneNumber] = useState('');
  // const [partnerLocationPicture, setPartnerLocationPicture] = useState('');

  const [isConfirmed, setIsConfirmed] = useState('No Request');
  const [partnerName, setPartnerName] = useState('');
  // const [partnerGoogleLink, setPartnerGoogleLink] = useState('');
  const [partnerGooglePlaceId, setPartnerGooglePlaceId] = useState('');
  const [partnerContactInfo, setPartnerContactInfo] = useState('');

  const authContext = useContext(AuthUserContext);
  // const navigate = useNavigate();
  const location = useLocation();
  const authData = location.state ? location.state.authData : null;
  // const { userType } = authData;

  // const [width, setWidth] = useState(0);
  // const ref = useRef(null);

  // useEffect(() => {
  //   setWidth(ref.current.offsetWidth);
  // }, []);

  // const onPartnerNameChange = (e) => {
  //   setPartnerName(e.target.value);
  // };
  // const onPartnerDescriptionChange = (e) => {
  //   setPartnerDescription(e.target.value);
  // };
  // const onPartnerCityChange = (e) => {
  //   setPartnerCity(e.target.value);
  // };
  // const onPartnerCountryChange = (e) => {
  //   setPartnerCountry(e.target.value);
  // };
  // const onPartnerAddressChange = (e) => {
  //   setPartnerAddress(e.target.value);
  // };
  // const onPartnerPhoneNumberChange = (e) => {
  //   setPartnerPhoneNumber(e.target.value);
  // };
  // const onPartnerLocationPictureChange = (e) => {
  //   setPartnerLocationPicture(e.target.value);
  // };

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
        handleEmail({
          to_name: authData.username, // auth.username
          to_email: 'anil.kults@gmail.com', // auth.email ?
          intro_message: `Your sign up request is processing. We will get in touch with you as soon as possible.`,
          request_id: 'New partner location sign up request'
        });
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
        backgroundColor: SECONDARY_COLOR
      }}>
      <Modal
        open={isConfirmed === 'No Request'}
        style={modalStyle}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box style={style}>
          <Grid
            container
            direction="column"
            alignItems="center"
            justifyContent="center"
            spacing={2}
            minWidth="60ch">
            <Typography variant="h6" component="h2" color="text.secondary">
              Please Send Confirmation Request!
            </Typography>

            <Grid item>
              <TextField
                id="standard-basic"
                label="Please enter the Google Place ID of the location"
                variant="standard"
                value={partnerGooglePlaceId}
                onChange={(event) => setPartnerGooglePlaceId(event.target.value)}
              />
            </Grid>
            <Grid item>
              <TextField
                id="standard-basic"
                label="Please enter the name of your business."
                variant="standard"
                value={partnerName}
                onChange={(event) => setPartnerName(event.target.value)}
              />
            </Grid>
            <Grid item>
              <TextField
                id="standard-basic"
                label="Please enter a contact number."
                variant="standard"
                value={partnerContactInfo}
                onChange={(event) => setPartnerContactInfo(event.target.value)}
              />
            </Grid>
            <br />
            <Button
              style={{
                color: '#FFFFFF',
                backgroundColor: green[500],
                width: '60%',
                border: 1,
                // borderColor: grey[500],
                borderRadius: 4,
                height: '60px'
              }}
              onClick={handleSendPartnerRequest}>
              Send Withdraw Request
            </Button>
          </Grid>
        </Box>
      </Modal>
      <Modal
        open={isConfirmed === 'Requested'}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{
          display: 'flex',
          justifyConent: 'center',
          alignItems: 'center'
        }}>
        <Box sx={style}>
          <div className="center">
            <Alert severity="info">
              <AlertTitle>Your request is processing!</AlertTitle>
              Your request is still under investigation. We will get in touch with you as soon as
              possible.
            </Alert>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default SignUpPartnerDataPage;
