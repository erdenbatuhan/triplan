import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Modal, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { green } from '@mui/material/colors';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import ItemListDisplay from '../components/PartnerLocationProfilePage/ItemListDisplay';
import RestaurantCuisineDisplay from '../components/PartnerLocationProfilePage/RestaurantCuisineDisplay';
import { getRestaurant, getTouristAttraction } from '../queries/partner-location-queries';
import { getMenuItems, getTickets } from '../queries/buyable-item-queries';
import InfoCard from '../components/InfoCard';
import { modalStyle } from '../shared/styles';
import { createNewPartnerSignupRequest } from '../queries/partner-signup-request-queries';
import { handleEmail } from '../queries/email-queries';

// import { modalStyle } from '../shared/styles';
// import TicketItemDisplay from '../components/RestaurantProfilePage/TicketItemsDisplay';
import { PARTNER_TYPE_RESTAURANT, PARTNER_TYPE_TOURIST_ATTRACTION } from '../shared/constants';

const mockImgData = {
  img: 'https://fastly.4sqi.net/img/general/width960/41222779_zbo5pj_DAblB24yPU--MnDvDmIlvqIGLuBkc8hZxmyY.jpg',
  title: ''
};

const style = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

export default function PartnerLocationProfilePage() {
  const [partner, setPartner] = useState({});
  const [cuisineList, setCuisineList] = useState([]);
  const [menuList, setMenuList] = useState([]);
  const [ticketList, setTicketList] = useState([]);
  const [isConfirmed, setIsConfirmed] = useState('No Request');
  const [partnerName, setPartnerName] = useState('');
  const [partnerGoogleLink, setPartnerGoogleLink] = useState('');
  const [partnerContactInfo, setPartnerContactInfo] = useState('');

  const location = useLocation();
  // Fetch the restaurant for every change in restaurant ID
  const { partnerId } = useParams();
  const navigate = useNavigate();
  const partnerLocationType = location.state ? location.state.partnerType : PARTNER_TYPE_RESTAURANT; // tourist-attraction // restaurant

  const handleEditClick = () => {
    navigate(`/edit-partner-profile/${partnerId}`, { state: { partnerType: partnerLocationType } });
  };

  const handleSendPartnerRequest = () => {
    const newRequest = {
      userId: partnerId,
      // username: partner.username,
      // email: partner.email,
      googleLocationLink: partnerGoogleLink,
      partnerLocationName: partnerName,
      partnerLocationContact: partnerContactInfo
      // partnerType: partner.partnerType
    };
    console.log(newRequest);
    createNewPartnerSignupRequest(newRequest).then(() => {
      setIsConfirmed('Requested');
      handleEmail({
        to_name: partner.username, // auth.username
        to_email: 'anil.kults@gmail.com',
        intro_message: `Your sign up request is processing. We will get in touch with you as soon as possible.`,
        request_id: 'New partner location sign up request'
      });
    });
  };

  console.log(isConfirmed);

  useEffect(() => {
    if (partnerLocationType === PARTNER_TYPE_RESTAURANT) {
      getRestaurant(partnerId).then((data) => {
        setPartner(data);
        console.log(data);
        setCuisineList(data.cuisines);
        setIsConfirmed(data.confirmed);
      });
      getMenuItems(partnerId).then((data) => {
        setMenuList(data);
      });
    } else if (partnerLocationType === PARTNER_TYPE_TOURIST_ATTRACTION) {
      getTouristAttraction(partnerId).then((data) => {
        setPartner(data);
        setIsConfirmed(data.confirmed);
      });
      getTickets(partnerId).then((data) => {
        setTicketList(data);
      });
    }
  }, [partnerId]);

  return (
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
      <Grid container direction="row" spacing={8}>
        <Grid item xs={3}>
          <Stack spacing={4}>
            <img
              src={`${partner.locationPicture}?w=164&h=164&fit=crop&auto=format`}
              srcSet={`${partner.locationPicture}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
              alt={mockImgData.title}
              loading="lazy"
              width={250}
              height={250}
            />
            <InfoCard title="Address" value={partner.address} />
            <InfoCard title="Phone Number" value={partner.phoneNumber} />
            <Button variant="contained" onClick={handleEditClick}>
              Edit Profile
            </Button>
          </Stack>
        </Grid>
        <Grid item xs={9}>
          <Stack>
            <Typography variant="h1" component="div" align="center">
              {partner.name}
            </Typography>
            {partnerLocationType === 'restaurant' ? (
              <Stack>
                <RestaurantCuisineDisplay cuisineList={cuisineList} />
                <ItemListDisplay itemList={menuList} inEdit={false} />
              </Stack>
            ) : (
              <ItemListDisplay itemList={ticketList} inEdit={false} />
            )}
          </Stack>
        </Grid>
      </Grid>

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
                label="Please enter the Google Maps Link of the location"
                variant="standard"
                value={partnerGoogleLink}
                onChange={(event) => setPartnerGoogleLink(event.target.value)}
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
    </Box>
  );
}
