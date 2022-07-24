import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Box, Grid, Typography, TextField, Button, Paper, List } from '@mui/material';
import Spinner from '../components/Spinner';
import EditRestaurantCuisineBox from '../components/PartnerLocationProfilePage/EditRestaurantCuisineBox';
import BuyableItemCard from '../components/PartnerLocationProfilePage/BuyableItemCard';
import EditItemModal from '../components/PartnerLocationProfilePage/EditItemModal';
import {
  getRestaurant,
  getTouristAttraction,
  saveRestaurant,
  saveTouristAttraction
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
import { PARTNER_TYPE_RESTAURANT, PARTNER_TYPE_TOURIST_ATTRACTION } from '../shared/constants';

export default function EditPartnerLocationProfilePage() {
  // TODO: will get partnerLocationType from auth token once the update on authentication occurs.
  const { partnerId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const partnerLocationType = location.state ? location.state.partnerType : PARTNER_TYPE_RESTAURANT; // restaurant or tourist-attraction

  const LABEL_PREFIX = partnerLocationType === PARTNER_TYPE_RESTAURANT ? 'Restaurant' : 'Museum';
  const ADD_BUTTON_TEXT = partnerLocationType === PARTNER_TYPE_RESTAURANT ? 'Menu' : 'Ticket';

  const [loading, setLoading] = useState(false);
  const [partner, setPartner] = useState({});
  const [partnerName, setPartnerName] = useState('');
  const [partnerAddress, setPartnerAddress] = useState('');
  const [partnerPhoneNumber, setPartnerPhoneNumber] = useState('');
  const [partnerLocationPicture, setPartnerLocationPicture] = useState('');

  // TODO: add food types for restaurants
  const [restaurantCuisines, setRestaurantCuisines] = useState([]);
  const [restaurantMenuList, setRestaurantMenuList] = useState([]);
  const [menuItemInEdit, setMenuItemInEdit] = useState([]);
  const [menuItemInDelete, setMenuItemInDelete] = useState([]);

  const [ticketList, setTicketList] = useState([]);
  const [ticketInEdit, setTicketInEdit] = useState([]);
  const [ticketInDelete, setTicketInDelete] = useState([]);

  const [itemEditAddMode, setItemEditAddMode] = useState(false);
  const [inAdd, setInAdd] = useState(false);

  // Listening to the changes in partnerId
  useEffect(() => {
    setLoading(true);
    let dataLoadPromises = [];

    if (partnerLocationType === PARTNER_TYPE_RESTAURANT) {
      dataLoadPromises = [
        getRestaurant(partnerId).then((data) => {
          setPartner(data);
          setRestaurantCuisines(data.cuisines);
        }),
        getMenuItems(partnerId).then((data) => {
          setRestaurantMenuList(data);
        })
      ];
    } else if (partnerLocationType === PARTNER_TYPE_TOURIST_ATTRACTION) {
      dataLoadPromises = [
        getTouristAttraction(partnerId).then((data) => {
          setPartner(data);
        }),
        getTickets(partnerId).then((data) => {
          setTicketList(data);
        })
      ];
    }

    Promise.all(dataLoadPromises).finally(() => setLoading(false));
  }, [partnerId]);

  // Listening to the changes in partner
  useEffect(() => {
    setPartnerName(partner.name);
    setPartnerAddress(partner.address);
    setPartnerPhoneNumber(partner.phoneNumber);
    setPartnerLocationPicture(partner.locationPicture);
  }, [partner]);

  const onPartnerNameChange = (event) => {
    setPartnerName(event.target.value);
  };

  const onPartnerAddressChange = (event) => {
    setPartnerAddress(event.target.value);
  };

  const onPartnerPhoneNumberChange = (event) => {
    setPartnerPhoneNumber(event.target.value);
  };

  const onPartnerLocationPictureChange = (event) => {
    setPartnerLocationPicture(event.target.value);
  };

  const handleCuisineChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setRestaurantCuisines((cuisines) => [...cuisines, value]);
    } else {
      setRestaurantCuisines((cuisines) => {
        return cuisines.filter((cuisine) => cuisine !== value);
      });
    }
  };

  const handleEditClick = (event) => {
    const editItemId = event.target.value;

    if (partnerLocationType === PARTNER_TYPE_RESTAURANT) {
      const editItem = restaurantMenuList.filter((_, idx) => idx.toString() === editItemId)[0];
      setMenuItemInEdit(editItem);
    } else if (partnerLocationType === PARTNER_TYPE_TOURIST_ATTRACTION) {
      const editItem = ticketList.filter((_, idx) => idx.toString() === editItemId)[0];
      setTicketInEdit(editItem);
    }

    setItemEditAddMode(true);
  };

  const handleDeleteClick = (event) => {
    const deleteItemId = event.target.value;

    if (partnerLocationType === PARTNER_TYPE_RESTAURANT) {
      const deleteItem = restaurantMenuList.filter((_, idx) => idx.toString() === deleteItemId)[0];

      setMenuItemInDelete((deletedMenuItems) => [...deletedMenuItems, deleteItem]);
      setRestaurantMenuList((menuList) => {
        return menuList.filter((_, idx) => idx.toString() !== deleteItemId);
      });
    } else if (partnerLocationType === PARTNER_TYPE_TOURIST_ATTRACTION) {
      const deleteItem = ticketList.filter((_, idx) => idx.toString() === deleteItemId)[0];

      setTicketInDelete((deletedTickets) => [...deletedTickets, deleteItem]);
      setTicketList((tickets) => {
        return tickets.filter((_, idx) => idx.toString() !== deleteItemId);
      });
    }
  };

  const handleEditCompletionClick = (_, updateParams) => {
    const getItems = (items) => {
      const itemsEdited = [...items];
      const itemIdx = itemsEdited.findIndex(({ _id }) => _id === updateParams._id);

      itemsEdited[itemIdx] = { ...itemsEdited[itemIdx], ...updateParams };
      return itemsEdited;
    };

    if (partnerLocationType === PARTNER_TYPE_RESTAURANT) {
      setRestaurantMenuList(getItems);
      setMenuItemInEdit({});
    } else if (partnerLocationType === PARTNER_TYPE_TOURIST_ATTRACTION) {
      setTicketList(getItems);
      setTicketInEdit({});
    }

    setItemEditAddMode(false);
  };

  const handleAddCompletionClick = async (_, newItem) => {
    if (partnerLocationType === PARTNER_TYPE_RESTAURANT) {
      setRestaurantMenuList((menuItems) => [newItem, ...menuItems]);
    } else if (partnerLocationType === PARTNER_TYPE_TOURIST_ATTRACTION) {
      setTicketList((ticketItems) => [newItem, ...ticketItems]);
    }

    setItemEditAddMode(false);
    setInAdd(false);
  };

  const handleItemChangeCompletionClick = async (event, params) => {
    if (!inAdd) {
      handleEditCompletionClick(event, params);
    } else {
      handleAddCompletionClick(event, params);
    }
  };

  const handleAddMenuItem = async () => {
    setItemEditAddMode(true);
    setInAdd(true);
  };

  const onSubmitClicked = async () => {
    const updatedLocation = {
      _id: partnerId,
      name: partnerName,
      address: partnerAddress,
      locationPicture: partnerLocationPicture
    };

    setLoading(true);
    let savePromises = [];

    if (partnerLocationType === PARTNER_TYPE_RESTAURANT) {
      savePromises = [
        // Save the restaurant
        saveRestaurant({
          ...updatedLocation,
          phoneNumber: partnerPhoneNumber,
          cuisines: restaurantCuisines
        }),
        // Create or update menu items
        Promise.all(
          restaurantMenuList.map((menu) => {
            if (menu._id) {
              return updateMenuItem(menu);
            }

            return addMenuItem(menu);
          })
        ),
        // Delete menu items that are in the deleted list
        Promise.all(
          menuItemInDelete.map((deletedMenu) => {
            return deleteMenuItem(deletedMenu._id);
          })
        )
      ];
    } else if (partnerLocationType === PARTNER_TYPE_TOURIST_ATTRACTION) {
      savePromises = [
        // Save the tourist attraction
        saveTouristAttraction(updatedLocation),
        // Create or update tickets
        Promise.all(
          ticketList.map((ticket) => {
            if (ticket._id) {
              return updateTicket(ticket);
            }

            return addTicket(ticket);
          })
        ),
        // Delete tickets that are in the deleted list
        Promise.all(
          ticketInDelete.map((deletedTicket) => {
            return deleteTicket(deletedTicket._id);
          })
        )
      ];
    }

    savePromises
      .then(() => {
        console.log('update is completed!');
        // navigate(`/partner-profile/${partnerId}`); TODO: Remove this, the state should update itself!
      })
      .catch((err) => {
        console.error(`failed to update partner location ${err}`);
      })
      .finally(() => setLoading(false));
  };

  const onCancelClicked = () => {
    navigate(`/partner-profile/${partnerId}`);
  };

  if (loading) {
    return <Spinner marginTop="5em" />;
  }

  return (
    <Box
      component="form"
      sx={{
        mt: 4,
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 5,
        minWidth: 400
      }}>
      <Grid container direction="column" justifyContent="center" alignItems="center" spacing={2}>
        <Grid item>
          <Typography align="center">Update your profile page!</Typography>
        </Grid>
        <Grid item>
          <Grid container direction="row" justifyContent="center" alignItems="center" spacing={2}>
            <Grid item>
              <TextField
                required
                id="outlined-required"
                label={`${LABEL_PREFIX} Name`}
                value={partnerName}
                onChange={onPartnerNameChange}
              />
            </Grid>
            <Grid item>
              <TextField
                required
                id="outlined-required"
                label={`${LABEL_PREFIX} Phone Number`}
                value={partnerPhoneNumber}
                onChange={onPartnerPhoneNumberChange}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container direction="row" justifyContent="center" alignItems="center" spacing={2}>
            <Grid item>
              <TextField
                required
                id="outlined-required"
                label={`${LABEL_PREFIX} Address`}
                value={partnerAddress}
                onChange={onPartnerAddressChange}
              />
            </Grid>
            <Grid item>
              <TextField
                required
                id="outlined-required"
                label={`${LABEL_PREFIX} Picture`}
                value={partnerLocationPicture}
                onChange={onPartnerLocationPictureChange}
              />
            </Grid>
          </Grid>
        </Grid>
        {partnerLocationType === PARTNER_TYPE_RESTAURANT ? (
          <Grid item>
            <EditRestaurantCuisineBox
              selectedItems={restaurantCuisines}
              handleChange={handleCuisineChange}
            />
          </Grid>
        ) : (
          // eslint-disable-next-line react/jsx-no-useless-fragment
          <></>
        )}
        <Grid item>
          <Paper style={{ maxHeight: 500, overflow: 'auto' }}>
            <List spacing={2} overflow="auto">
              {(partnerLocationType === PARTNER_TYPE_RESTAURANT
                ? restaurantMenuList || []
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
                    handleEditClick={handleEditClick}
                    handleDeleteClick={handleDeleteClick}
                    inEdit
                  />
                );
              })}
            </List>
          </Paper>
          <EditItemModal
            key={
              partnerLocationType === PARTNER_TYPE_RESTAURANT
                ? menuItemInEdit._id
                : ticketInEdit._id
            }
            item={partnerLocationType === PARTNER_TYPE_RESTAURANT ? menuItemInEdit : ticketInEdit}
            locationType={partnerLocationType}
            handleItemChangeCompletionClick={handleItemChangeCompletionClick}
            inAdd={inAdd}
            itemEditAddMode={itemEditAddMode}
          />
        </Grid>
        <Grid item>
          <Button onClick={handleAddMenuItem}>Add New {ADD_BUTTON_TEXT}</Button>
        </Grid>
        <Grid item>
          <Button onClick={onCancelClicked}>Cancel Update</Button>
          <Button onClick={onSubmitClicked}>Update Profile</Button>
        </Grid>
      </Grid>
    </Box>
  );
}
