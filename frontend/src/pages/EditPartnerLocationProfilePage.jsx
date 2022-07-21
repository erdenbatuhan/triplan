import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Box, Grid, Typography, TextField, Button, Paper, List } from '@mui/material';
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
  addTicket
} from '../queries/buyable-item-queries';
import EditRestaurantCuisineBox from '../components/PartnerLocationProfilePage/EditRestaurantCuisineBox';
import BuyableItemCard from '../components/PartnerLocationProfilePage/BuyableItemCard';
import EditItemModal from '../components/PartnerLocationProfilePage/EditItemModal';

function EditPartnerLocationProfilePage() {
  const [partner, setPartner] = useState({});
  const [partnerName, setPartnerName] = useState('');
  const [partnerAddress, setPartnerAddress] = useState('');
  const [partnerPhoneNumber, setPartnerPhoneNumber] = useState('');
  const [partnerLocationPicture, setPartnerLocationPicture] = useState('');

  // TODO: add food types for restaurants
  const [restaurantCuisines, setRestaurantCuisines] = useState([]);
  const [restaurantMenuList, setRestaurantMenuList] = useState([]);
  const [menuItemInEdit, setMenuItemInEdit] = useState([]);

  const [ticketList, setTicketList] = useState([]);
  const [ticketInEdit, setTicketInEdit] = useState([]);

  const [itemEditAddMode, setItemEditAddMode] = useState(false);
  const [inAdd, setInAdd] = useState(false);
  // TODO: will get partnerLocationType from auth token once the update on authentication occurs.
  const { partnerId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  // const partnerLocationType = location.state.partnerType;
  const partnerLocationType = location.state ? location.state.partnerType : 'restaurant'; // restaurant - tourist-attraction
  const nameLabel = partnerLocationType === 'restaurant' ? 'Restaurant Name' : 'Museum Name';
  const phoneLabel =
    partnerLocationType === 'restaurant' ? 'Restaurant Phone Number' : 'Museum Phone Number';
  const addressLabel =
    partnerLocationType === 'restaurant' ? 'Restaurant Address' : 'Museum Address';
  const pictureLabel =
    partnerLocationType === 'restaurant' ? 'Restaurant Picture' : 'Museum Picture';

  const addButtonText = partnerLocationType === 'restaurant' ? 'Menu' : 'Ticket';

  useEffect(() => {
    if (partnerLocationType === 'restaurant') {
      getRestaurant(partnerId).then((data) => {
        setPartner(data);
        setRestaurantCuisines(data.cuisines);
      });
      getMenuItems(partnerId).then((data) => {
        setRestaurantMenuList(data);
      });
    } else if (partnerLocationType === 'tourist-attraction') {
      getTouristAttraction(partnerId).then((data) => {
        setPartner(data);
      });
      getTickets(partnerId).then((data) => {
        setTicketList(data);
      });
    }
  }, [partnerId]);

  useEffect(() => {
    setPartnerName(partner.name);
    setPartnerAddress(partner.address);
    setPartnerPhoneNumber(partner.phoneNumber);
    setPartnerLocationPicture(partner.locationPicture);
  }, [partner]);

  const onPartnerNameChange = (e) => {
    setPartnerName(e.target.value);
  };
  const onPartnerAddressChange = (e) => {
    setPartnerAddress(e.target.value);
  };
  const onPartnerPhoneNumberChange = (e) => {
    setPartnerPhoneNumber(e.target.value);
  };
  const onPartnerLocationPictureChange = (e) => {
    setPartnerLocationPicture(e.target.value);
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

  const handleEditClick = (e) => {
    const editItemId = e.target.value;
    if (partnerLocationType === 'restaurant') {
      const editItem = restaurantMenuList.filter((_, idx) => idx.toString() === editItemId)[0];
      setMenuItemInEdit(editItem);
    } else if (partnerLocationType === 'tourist-attraction') {
      const editItem = ticketList.filter((_, idx) => idx.toString() === editItemId)[0];
      setTicketInEdit(editItem);
    }
    setItemEditAddMode(true);
  };

  const handleEditCompletionClick = (e, updateParams) => {
    if (partnerLocationType === 'restaurant') {
      setRestaurantMenuList((menuItems) => {
        const items = [...menuItems];
        const idxItem = items.findIndex((item) => item._id === updateParams._id);
        const menuItemsEdited = { ...items[idxItem] };
        menuItemsEdited.name = updateParams.name;
        menuItemsEdited.description = updateParams.description;
        menuItemsEdited.price = updateParams.price;
        menuItemsEdited.type = updateParams.type;
        menuItemsEdited.image = updateParams.image;
        items[idxItem] = menuItemsEdited;
        return items;
      });
      setMenuItemInEdit({});
    } else if (partnerLocationType === 'tourist-attraction') {
      // const { ticketReservationDate } = updateParams;
      setTicketList((ticketItems) => {
        const items = [...ticketItems];
        const idxItem = items.findIndex((item) => item._id === updateParams._id);
        const ticketItemsEdited = { ...items[idxItem] };
        ticketItemsEdited.name = updateParams.name;
        ticketItemsEdited.description = updateParams.description;
        ticketItemsEdited.price = updateParams.price;
        ticketItemsEdited.image = updateParams.image;
        items[idxItem] = ticketItemsEdited;
        return items;
      });
      setTicketInEdit({});
    }
    setItemEditAddMode(false);
  };

  const handleAddMenuItem = async () => {
    setItemEditAddMode(true);
    setInAdd(true);
  };

  const handleAddCompletionClick = async (e, newItem) => {
    if (partnerLocationType === 'restaurant') {
      setRestaurantMenuList((menuItems) => [newItem, ...menuItems]);
    } else if (partnerLocationType === 'tourist-attraction') {
      setTicketList((ticketItems) => [newItem, ...ticketItems]);
    }
    setItemEditAddMode(false);
    setInAdd(false);
  };

  const handleItemChangeCompletionClick = async (e, params) => {
    if (!inAdd) {
      handleEditCompletionClick(e, params);
    } else {
      handleAddCompletionClick(e, params);
    }
  };

  const onSubmitClicked = async () => {
    try {
      const updatedLocation = {
        _id: partnerId,
        name: partnerName,
        address: partnerAddress,
        locationPicture: partnerLocationPicture
      };
      if (partnerLocationType === 'restaurant') {
        Promise.all([
          saveRestaurant({
            ...updatedLocation,
            phoneNumber: partnerPhoneNumber,
            cuisines: restaurantCuisines
          }),
          restaurantMenuList.map((menu) => {
            const menuExists = typeof menu._id !== 'undefined';
            if (menuExists) {
              return updateMenuItem(menu);
            }
            return addMenuItem(menu);
          })
        ]).then(() => console.log('update is completed!'));
      } else if (partnerLocationType === 'tourist-attraction') {
        Promise.all([
          saveTouristAttraction(updatedLocation),
          ticketList.map((ticket) => {
            const ticketExists = typeof ticket._id !== 'undefined';
            if (ticketExists) {
              return updateTicket(ticket);
            }
            return addTicket(ticket);
          })
        ]).then(() => console.log('update is completed!'));
      }
      navigate(`/partner-profile/${partnerId}`);
    } catch (e) {
      console.error(`failed to update partner location ${e}`);
    }
  };

  const onCancelClicked = () => {
    navigate(`/partner-profile/${partnerId}`);
  };

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
                label={nameLabel}
                value={partnerName}
                onChange={(e) => onPartnerNameChange(e)}
              />
            </Grid>
            <Grid item>
              <TextField
                required
                id="outlined-required"
                label={phoneLabel}
                value={partnerPhoneNumber}
                onChange={(e) => onPartnerPhoneNumberChange(e)}
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
                label={addressLabel}
                value={partnerAddress}
                onChange={(e) => onPartnerAddressChange(e)}
              />
            </Grid>
            <Grid item>
              <TextField
                required
                id="outlined-required"
                label={pictureLabel}
                value={partnerLocationPicture}
                onChange={(e) => onPartnerLocationPictureChange(e)}
              />
            </Grid>
          </Grid>
        </Grid>
        {partnerLocationType === 'restaurant' ? (
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
              {(partnerLocationType === 'restaurant' ? restaurantMenuList : ticketList).map(
                (item, idx) => {
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
                      inEdit
                    />
                  );
                }
              )}
            </List>
          </Paper>
          <EditItemModal
            key={partnerLocationType === 'restaurant' ? menuItemInEdit._id : ticketInEdit._id}
            item={partnerLocationType === 'restaurant' ? menuItemInEdit : ticketInEdit}
            locationType={partnerLocationType}
            handleItemChangeCompletionClick={handleItemChangeCompletionClick}
            inAdd={inAdd}
            itemEditAddMode={itemEditAddMode}
          />
        </Grid>
        <Grid item>
          <Button onClick={handleAddMenuItem}>Add New {addButtonText}</Button>
        </Grid>
        <Grid item>
          <Button onClick={onCancelClicked}>Cancel Update</Button>
          <Button onClick={onSubmitClicked}>Update Profile</Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default EditPartnerLocationProfilePage;