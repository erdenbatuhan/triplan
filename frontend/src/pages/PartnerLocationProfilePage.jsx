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
// import TourIcon from '@mui/icons-material/Tour';
// import ItemListDisplay from '../components/PartnerLocationProfilePage/ItemListDisplay';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RestaurantCuisineDisplay from '../components/PartnerLocationProfilePage/RestaurantCuisineDisplay';
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
import EditPartnerLocationCard from '../components/PartnerLocationProfilePage/EditPartnerLocationCard';

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
  const [lazyLoading, setLazyLoading] = useState(false);

  // Fetch the restaurant for every change in restaurant ID
  const { partnerId } = useParams();

  const [partner, setPartner] = useState({});

  const [cuisineList, setCuisineList] = useState([]);
  const [foodTypeList, setFoodTypeList] = useState([]);
  const [priceLevels, setPriceLevels] = useState([]);
  // const [touristAttractionTypes, setTouristAttractionTypes] = useState([]);

  const [menuList, setMenuList] = useState([]);
  const [ticketList, setTicketList] = useState([]);
  const [isConfirmed, setIsConfirmed] = useState('No Request');
  const [partnerName, setPartnerName] = useState('');
  const [partnerGoogleLink, setPartnerGoogleLink] = useState('');
  const [partnerContactInfo, setPartnerContactInfo] = useState('');
  const [partnerLocationPicture, setPartnerLocationPicture] = useState('');

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
    setIsPartnerLocationEditMode(false);
    setLazyLoading(false);
    setLoading(true);

    getPartnerLocationById(partnerId)
      .then(({ partnerLocation }) => {
        setPartner(partnerLocation);
        setIsConfirmed(partnerLocation.confirmed);
        setPartnerLocationPicture(partnerLocation.locationPicture);

        if (partnerLocation.partnerType === PARTNER_TYPE_RESTAURANT) {
          getMenuItems(partnerId).then((data) => {
            setMenuList(data);
          });
          setCuisineList(partnerLocation.cuisines);
          setFoodTypeList(partnerLocation.foodTypes);
          setPriceLevels(partnerLocation.priceLevels);
        } else if (partnerLocation.partnerType === PARTNER_TYPE_TOURIST_ATTRACTION) {
          getTickets(partnerId).then((data) => {
            setTicketList(data);
          });
          // setTouristAttractionTypes(partnerLocation.touristAttractionTypes);
        }
      })
      .finally(() => setLoading(false));
  }, [partnerId]);

  const handlePartnerFieldsChange = (params) => {
    const updatedLocation = {
      _id: partnerId,
      name: params.partnerName,
      address: params.partnerAddress,
      locationPicture: params.partnerLocationPicture
    };

    setLazyLoading(true);

    if (partner.partnerType === PARTNER_TYPE_RESTAURANT) {
      saveRestaurant({
        ...updatedLocation,
        phoneNumber: params.partnerPhoneNumber,
        cuisines: params.restaurantCuisines,
        foodTypes: params.restaurantFoodTypes,
        priceLevels: params.restaurantPriceLevels,
        locationPicture: params.partnerLocationPicture
      })
        .then(() =>
          getRestaurant(partnerId).then((data) => {
            setPartner(data);
            setCuisineList(data.cuisines);
            setFoodTypeList(data.foodTypes);
            setPriceLevels(data.priceLevels);
            setPartnerLocationPicture(data.locationPicture);
          })
        )
        .finally(() => {
          setIsPartnerLocationEditMode(false);
          setLazyLoading(false);
        });
    } else if (partner.partnerType === PARTNER_TYPE_TOURIST_ATTRACTION) {
      saveTouristAttraction(updatedLocation)
        .then(() =>
          getTouristAttraction(partnerId).then((data) => {
            setPartner(data);
            setPartnerLocationPicture(data.locationPicture);
            // setTouristAttractionTypes(data.touristAttractionTypes);
          })
        )
        .finally(() => {
          setIsPartnerLocationEditMode(false);
          setLazyLoading(false);
        });
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
    setLazyLoading(true);

    if (partner.partnerType === PARTNER_TYPE_RESTAURANT) {
      updateMenuItem(updateParams)
        .then(() =>
          getMenuItems(partnerId).then((data) => {
            setMenuList(data);
          })
        )
        .finally(() => {
          setLazyLoading(false);
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
          setLazyLoading(false);
          setItemEditAddMode(false);
        });
    }
  };

  const handleAddCompletionClick = async (_, newItem) => {
    setLazyLoading(true);

    if (partner.partnerType === PARTNER_TYPE_RESTAURANT) {
      addMenuItem(newItem)
        .then((menuItemCreated) => {
          setMenuList([menuItemCreated, ...menuList]);
        })
        .finally(() => {
          setLazyLoading(false);
          setItemEditAddMode(false);
          setItemInAdd(false);
        });
    } else if (partner.partnerType === PARTNER_TYPE_TOURIST_ATTRACTION) {
      addTicket(newItem)
        .then((ticketCreated) => {
          setTicketList([ticketCreated, ...ticketList]);
        })
        .finally(() => {
          setLazyLoading(false);
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
    setLazyLoading(true);

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
          setLazyLoading(false);
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
          setLazyLoading(false);
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
            <Avatar sx={avatarStyle} src={partnerLocationPicture} loading="lazy" />
          </Grid>

          {partner.address ? (
            <Grid item xs={3} display="flex">
              <IconButton
                disabled
                sx={{
                  ml: 4,
                  pr: 0,
                  mt: 1,
                  '&.MuiButtonBase-root:hover': {
                    bgcolor: 'transparent'
                  }
                }}>
                <PlaceIcon />
              </IconButton>

              <Typography component="div" align="center" mt={2} sx={{ fontSize: 'subtitle1' }}>
                {partner.address}
              </Typography>
            </Grid>
          ) : (
            []
          )}

          {partner.phoneNumber ? (
            <Grid item xs={3} display="flex">
              <IconButton
                disabled
                sx={{
                  ml: 1,
                  '&.MuiButtonBase-root:hover': {
                    bgcolor: 'transparent'
                  }
                }}>
                <PhoneIcon />
              </IconButton>

              <Typography component="div" align="center" m={1} sx={{ fontSize: 'subtitle1' }}>
                {partner.phoneNumber}
              </Typography>
            </Grid>
          ) : (
            []
          )}

          {/* touristAttractionTypes.length > 0 ? (
            <Grid item xs={3} display="flex">
              <IconButton pointerEvents="none">
                <TourIcon />
              </IconButton>

              <Typography component="div" align="center" m={1} sx={{ fontSize: 'subtitle1' }}>
                {touristAttractionTypes}
              </Typography>
            </Grid>
          ) : (
            []
          ) */}

          <Grid item display="grid">
            <RestaurantCuisineDisplay displayList={cuisineList} isCuisine />
          </Grid>

          <Grid item display="grid">
            <RestaurantCuisineDisplay displayList={foodTypeList} isCuisine={false} />
          </Grid>

          <Grid item xs={3} display="flex">
            <Typography component="div" align="center" m={1} sx={{ fontSize: 'h6' }}>
              {priceLevels.join(' | ')}
            </Typography>
          </Grid>
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
            lazyLoading={lazyLoading}
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
                      partnerType={partner.partnerType}
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
                  lazyLoading={lazyLoading}
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
}
