import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  Button,
  Modal,
  TextField,
  Avatar,
  IconButton,
  Divider,
  Paper,
  List,
  Tooltip
} from '@mui/material';
import { green } from '@mui/material/colors';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import PlaceIcon from '@mui/icons-material/Place';
import PhoneIcon from '@mui/icons-material/Phone';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import MenuBookIcon from '@mui/icons-material/MenuBook';
// import ItemListDisplay from '../components/PartnerLocationProfilePage/ItemListDisplay';
// import RestaurantCuisineDisplay from '../components/PartnerLocationProfilePage/RestaurantCuisineDisplay';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import BuyableItemCard from '../components/PartnerLocationProfilePage/BuyableItemCard';
import {
  getRestaurant,
  getTouristAttraction,
  saveRestaurant,
  saveTouristAttraction,
  getPartnerLocationById
} from '../queries/partner-location-queries';
import {
  getMenuItems,
  getTickets,
  updateMenuItem,
  updateTicket,
  addMenuItem,
  addTicket,
  deleteMenuItem,
  deleteTicket
} from '../queries/buyable-item-queries';
// import InfoCard from '../components/InfoCard';
import { createNewPartnerSignupRequest } from '../queries/partner-signup-request-queries';
import { handleEmail } from '../queries/email-queries';
import ContentModal from '../components/common/ContentModal';
import Spinner from '../components/common/Spinner';

// import { modalStyle } from '../shared/styles';
// import TicketItemDisplay from '../components/RestaurantProfilePage/TicketItemsDisplay';
import { PARTNER_TYPE_RESTAURANT, PARTNER_TYPE_TOURIST_ATTRACTION } from '../shared/constants';
import EditItemModal from '../components/PartnerLocationProfilePage/EditItemModal';
import EditPartnerLocationCard from '../components/EditPartnerLocationCard';

const style = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const avatarStyle = {
  width: '200px',
  height: '200px'
};

export default function PartnerLocationProfilePage() {
  const [loading, setLoading] = useState(false);

  // Fetch the restaurant for every change in restaurant ID
  const { partnerId } = useParams();

  const [partner, setPartner] = useState({});

  // const [cuisineList, setCuisineList] = useState([]);
  const [menuList, setMenuList] = useState([]);
  const [ticketList, setTicketList] = useState([]);
  const [isConfirmed, setIsConfirmed] = useState('No Request');
  const [partnerName, setPartnerName] = useState('');
  const [partnerGoogleLink, setPartnerGoogleLink] = useState('');
  const [partnerContactInfo, setPartnerContactInfo] = useState('');

  const [isPartnerLocationEditMode, setIsPartnerLocationEditMode] = useState(false);

  const [menuItemInEdit, setMenuItemInEdit] = useState([]);
  // const [menuItemInDelete, setMenuItemInDelete] = useState([]);
  const [ticketInEdit, setTicketInEdit] = useState([]);
  // const [ticketInDelete, setTicketInDelete] = useState([]);

  const [itemEditAddMode, setItemEditAddMode] = useState(false);
  const [itemInAdd, setItemInAdd] = useState(false);

  const handleProfileEditClick = () => {
    // navigate(`/edit-partner-profile/${partnerId}`, { state: { partnerType: partnerLocationType } });
    setIsPartnerLocationEditMode(true);
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
    getPartnerLocationById(partnerId).then(({ partnerLocation }) => {
      setPartner(partnerLocation);
      setIsConfirmed(partnerLocation.confirmed);

      if (partnerLocation.partnerType === PARTNER_TYPE_RESTAURANT) {
        getMenuItems(partnerId).then((data) => {
          setMenuList(data);
        });
        // setCuisineList(partnerLocation.cuisines);
      } else if (partnerLocation.partnerType === PARTNER_TYPE_TOURIST_ATTRACTION) {
        getTickets(partnerId).then((data) => {
          setTicketList(data);
        });
      }
    });
  }, [partnerId]);

  const handlePartnerFieldsChange = (params) => {
    const updatedLocation = {
      _id: partnerId,
      name: params.partnerName,
      address: params.partnerAddress,
      locationPicture: params.partnerLocationPicture
    };

    setLoading(true);

    if (partner.partnerType === PARTNER_TYPE_RESTAURANT) {
      saveRestaurant({
        ...updatedLocation,
        phoneNumber: params.partnerPhoneNumber,
        cuisines: params.restaurantCuisines
      })
        .then(() => getRestaurant(partnerId).then((data) => setPartner(data)))
        .finally(() => setLoading(false));
    } else if (partner.partnerType === PARTNER_TYPE_TOURIST_ATTRACTION) {
      saveTouristAttraction(updatedLocation)
        .then(() => getTouristAttraction(partnerId).then((data) => setPartner(data)))
        .finally(() => setLoading(false));
    }
  };

  const handleBuyableItemEditClick = (event) => {
    const editItemId = event.target.value;

    if (partner.partnerType === PARTNER_TYPE_RESTAURANT) {
      const editItem = menuList.filter((_, idx) => idx.toString() === editItemId)[0];
      setMenuItemInEdit(editItem);
    } else if (partner.partnerType === PARTNER_TYPE_TOURIST_ATTRACTION) {
      const editItem = ticketList.filter((_, idx) => idx.toString() === editItemId)[0];
      setTicketInEdit(editItem);
    }

    setItemEditAddMode(true);
  };

  const handleEditCompletionClick = (_, updateParams) => {
    setLoading(true);

    if (partner.partnerType === PARTNER_TYPE_RESTAURANT) {
      updateMenuItem(updateParams)
        .then(() =>
          getMenuItems(partnerId).then((data) => {
            setMenuList(data);
          })
        )
        .finally(() => {
          setLoading(false);
          setItemEditAddMode(false);
        });
    } else if (partner.partnerType === PARTNER_TYPE_TOURIST_ATTRACTION) {
      updateTicket(updateParams)
        .then(() =>
          getTickets(partnerId).then((data) => {
            setTicketList(data);
          })
        )
        .finally(() => {
          setLoading(false);
          setItemEditAddMode(false);
        });
    }
  };

  const handleAddCompletionClick = async (_, newItem) => {
    setLoading(true);

    if (partner.partnerType === PARTNER_TYPE_RESTAURANT) {
      addMenuItem(newItem)
        .then((menuItemCreated) => {
          setMenuList([menuItemCreated, ...menuList]);
        })
        .finally(() => {
          setLoading(false);
          setItemEditAddMode(false);
          setItemInAdd(false);
        });
    } else if (partner.partnerType === PARTNER_TYPE_TOURIST_ATTRACTION) {
      addTicket(newItem)
        .then((ticketCreated) => {
          setTicketList([ticketCreated, ...ticketList]);
        })
        .finally(() => {
          setLoading(false);
          setItemEditAddMode(false);
          setItemInAdd(false);
        });
    }
  };

  const handleItemChangeCompletionClick = async (event, params) => {
    if (!itemInAdd) {
      handleEditCompletionClick(event, params);
    } else {
      handleAddCompletionClick(event, params);
    }
  };

  const handleAddMenuItem = async () => {
    setItemEditAddMode(true);
    setItemInAdd(true);
  };

  const handleBuyableItemDeleteClick = (event) => {
    const deleteItemId = event.target.value;

    if (partner.partnerType === PARTNER_TYPE_RESTAURANT) {
      const deleteItem = menuList.filter((_, idx) => idx.toString() === deleteItemId)[0];
      deleteMenuItem(deleteItem._id)
        .then(() =>
          getMenuItems(partnerId).then((data) => {
            setMenuList(data);
          })
        )
        .finally(() => {
          setLoading(false);
        });
    } else if (partner.partnerType === PARTNER_TYPE_TOURIST_ATTRACTION) {
      const deleteItem = ticketList.filter((_, idx) => idx.toString() === deleteItemId)[0];

      deleteTicket(deleteItem._id)
        .then(() =>
          getTickets(partnerId).then((data) => {
            setTicketList(data);
          })
        )
        .finally(() => {
          setLoading(false);
        });
    }
  };

  if (loading) {
    return <Spinner marginTop="5em" />;
  }

  return (
    <Grid container spacing={2} m={5}>
      <Grid item xs={3}>
        <Grid container direction="column" justifyContent="center" alignItems="center" spacing={1}>
          <Grid item xs={6}>
            <Avatar sx={avatarStyle} src={partner.locationPicture} loading="lazy" />
          </Grid>

          {partner.address ? (
            <Grid item xs={3} display="flex">
              <IconButton pointerEvents="none">
                <PlaceIcon />
              </IconButton>

              <Typography component="div" align="center" m={1} sx={{ fontSize: 'subtitle1' }}>
                {partner.address}
              </Typography>
            </Grid>
          ) : (
            []
          )}

          {partner.phoneNumber ? (
            <Grid item xs={3} display="flex">
              <IconButton pointerEvents="none">
                <PhoneIcon />
              </IconButton>

              <Typography component="div" align="center" m={1} sx={{ fontSize: 'subtitle1' }}>
                {partner.phoneNumber}
              </Typography>
            </Grid>
          ) : (
            []
          )}

          {partner.cuisines ? (
            <Grid item display="flex">
              <IconButton pointerEvents="none">
                <RestaurantIcon />
              </IconButton>

              <Typography
                component="div"
                sx={{ fontSize: 'subtitle1', color: 'text.secondary', pt: 1 }}>
                {partner.cuisines.join(' ')}
              </Typography>
            </Grid>
          ) : (
            <Grid item />
          )}

          {partner.foodTypes ? (
            <Grid item display="flex">
              <IconButton pointerEvents="none">
                <MenuBookIcon />
              </IconButton>

              <Typography
                component="div"
                sx={{ fontSize: 'subtitle1', color: 'text.secondary', pt: 1 }}>
                {partner.foodTypes.join(' ')}
              </Typography>
            </Grid>
          ) : (
            <Grid item />
          )}
        </Grid>

        <Grid item display="grid" sx={{ m: 2 }}>
          <Button variant="contained" onClick={handleProfileEditClick}>
            Edit Profile
          </Button>
        </Grid>
      </Grid>

      <ContentModal
        open={isPartnerLocationEditMode}
        onClose={() => {
          setIsPartnerLocationEditMode(false);
        }}
        contentStyle={{ minWidth: '500px' }}
        header="Edit Profile"
        contentRendered={
          <EditPartnerLocationCard
            partner={partner}
            handlePartnerFieldsChange={handlePartnerFieldsChange}
          />
        }
      />

      <Grid item xs={1} />

      <Grid item xs={6}>
        <Grid>
          <Grid container direction="row">
            <Grid item>
              <Typography variant="h2" component="div" align="left" color="text.secondary">
                {partner.name}
              </Typography>
            </Grid>

            <Grid item>
              <Tooltip
                title={
                  partner.partnerType === PARTNER_TYPE_RESTAURANT
                    ? 'Add new menu'
                    : 'Add new ticket'
                }>
                <IconButton sx={{ m: 2 }} onClick={handleAddMenuItem}>
                  <AddCircleOutlineIcon fontSize="large" />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>

          <Divider sx={{ mb: 2 }} />
        </Grid>
        <Grid container direction="column" justifyContent="center" alignItems="center" spacing={4}>
          {/* <Grid item xs={9} sx={{ width: '100%' }}>
            <Stack>
              {partnerLocationType === 'restaurant' ? (
                <Stack>
                  <RestaurantCuisineDisplay cuisineList={cuisineList} />
                  <ItemListDisplay itemList={menuList} inEdit={false} />
                </Stack>
              ) : (
                <ItemListDisplay itemList={ticketList} inEdit={false} />
              )}
            </Stack>
              </Grid> */}
          <Grid item xs={9} sx={{ width: '100%' }}>
            <Paper style={{ maxHeight: 500, overflow: 'auto' }}>
              <List spacing={2} overflow="auto">
                {(partner.partnerType === PARTNER_TYPE_RESTAURANT
                  ? menuList || []
                  : ticketList || []
                ).map((item, idx) => {
                  return (
                    <BuyableItemCard
                      key={item._id}
                      menuId={item._id}
                      itemIdx={idx}
                      name={item.name}
                      content={item.description}
                      price={item.price.toString()}
                      image={item.image}
                      handleBuyableItemEditClick={handleBuyableItemEditClick}
                      handleBuyableItemDeleteClick={handleBuyableItemDeleteClick}
                      // inEdit
                    />
                  );
                })}
              </List>
            </Paper>

            <ContentModal
              open={itemEditAddMode}
              onClose={() => {
                setItemEditAddMode(false);
              }}
              header={`${itemInAdd ? 'Create New' : 'Edit'} ${
                partner.partnerType === PARTNER_TYPE_RESTAURANT ? 'Menu' : 'Ticket'
              }`}
              contentRendered={
                <EditItemModal
                  key={
                    partner.partnerType === PARTNER_TYPE_RESTAURANT
                      ? menuItemInEdit._id
                      : ticketInEdit._id
                  }
                  item={
                    partner.partnerType === PARTNER_TYPE_RESTAURANT ? menuItemInEdit : ticketInEdit
                  }
                  locationType={partner.partnerType}
                  handleItemChangeCompletionClick={handleItemChangeCompletionClick}
                  itemInAdd={itemInAdd}
                />
              }
            />
          </Grid>
        </Grid>
      </Grid>

      <Modal
        open={isConfirmed === 'No Request'}
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
    </Grid>
  );

  /* 
   const location = useLocation();
   const navigate = useNavigate();
   const partnerLocationType = location.state ? location.state.partnerType : PARTNER_TYPE_RESTAURANT; // tourist-attraction // restaurant

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
  ); */
}
