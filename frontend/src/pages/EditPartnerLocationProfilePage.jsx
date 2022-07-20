import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Box, Grid, Typography, TextField, Button, Stack, Paper, List } from '@mui/material';
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
  updateTicket
} from '../queries/buyable-item-queries';
import EditRestaurantCuisineBox from '../components/RestaurantProfilePage/EditRestaurantCuisineBox';
// import RestaurantMenuItems from '../components/RestaurantProfilePage/RestaurantMenuItems';
import MenuCard from '../components/RestaurantProfilePage/MenuCard';
import EditMenuItem from '../components/RestaurantProfilePage/EditMenuItem';

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

  // TODO: will get partnerLocationType from auth token once the update on authentication occurs.
  const { partnerId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  // const partnerLocationType = location.state.partnerType;
  const partnerLocationType = location.state ? location.state.partnerType : 'restaurant';
  const nameLabel = partnerLocationType === 'restaurant' ? 'Restaurant Name' : 'Museum Name';
  const phoneLabel =
    partnerLocationType === 'restaurant' ? 'Restaurant Phone Number' : 'Museum Phone Number';
  const addressLabel =
    partnerLocationType === 'restaurant' ? 'Restaurant Address' : 'Museum Address';
  const pictureLabel =
    partnerLocationType === 'restaurant' ? 'Restaurant Picture' : 'Museum Picture';

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

  const onRestaurantNameChanged = (e) => {
    setPartnerName(e.target.value);
  };
  const onRestaurantAddressChanged = (e) => {
    setPartnerAddress(e.target.value);
  };
  const onRestaurantPhoneNumberChanged = (e) => {
    setPartnerPhoneNumber(e.target.value);
  };
  const onRestaurantLocationPictureChanged = (e) => {
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
      const editItem = restaurantMenuList.filter((menu) => menu._id === editItemId)[0];
      // setMenuItemsInEdit((menuItems) => [...menuItems, editItem]);
      setMenuItemInEdit(editItem);
    } else if (partnerLocationType === 'tourist-attraction') {
      const editItem = ticketList.filter((ticket) => ticket._id === editItemId)[0];
      // setTicketsInEdit((tickets) => [...tickets, editItem]);
      setTicketInEdit(editItem);
    }
    setItemEditAddMode(true);
  };

  const handleUpdateCompletionClick = (e, updateParams) => {
    const { _id, itemName, itemDescription, itemPrice } = updateParams;
    if (partnerLocationType === 'restaurant') {
      const { itemType, itemPicture } = updateParams;
      setRestaurantMenuList((menuItems) => {
        const items = [...menuItems];
        const idxItem = items.findIndex((item) => item._id === _id);
        const menuItemsEdited = { ...items[idxItem] };
        menuItemsEdited.name = itemName;
        menuItemsEdited.description = itemDescription;
        menuItemsEdited.price = itemPrice;
        menuItemsEdited.type = itemType;
        menuItemsEdited.image = itemPicture;
        items[idxItem] = menuItemsEdited;
        return items;
      });
      setMenuItemInEdit((menuItems) => {
        return menuItems.filter((menuItem) => menuItem._id !== _id);
      });
    } else if (partnerLocationType === 'tourist-attraction') {
      // const { ticketReservationDate } = updateParams;
      setTicketList((ticketItems) => {
        const items = [...ticketItems];
        const idxItem = items.findIndex((item) => item._id === _id);
        const ticketItemsEdited = { ...items[idxItem] };
        ticketItemsEdited.name = itemName;
        ticketItemsEdited.description = itemDescription;
        ticketItemsEdited.price = itemPrice;
        items[idxItem] = ticketItemsEdited;
        return items;
      });
      setTicketInEdit((tickets) => {
        return tickets.filter((ticket) => ticket._id !== _id);
      });
    }
    setItemEditAddMode(true);
  };

  const handleAddMenuItem = async () => {
    setItemEditAddMode(true);
  };

  const handleAddCompletionClick = async (e, newItem) => {
    if (partnerLocationType === 'restaurant') {
      setRestaurantMenuList((menuItems) => [...menuItems, newItem]);
    } else if (partnerLocationType === 'tourist-attraction') {
      setTicketList((ticketItems) => [...ticketItems, newItem]);
    }
  };

  const handleItemChangeCompletionClick = async (e, params) => {
    if (itemEditAddMode) {
      handleUpdateCompletionClick(e, params);
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
          restaurantMenuList.map((menu) => updateMenuItem(menu))
        ]).then(() => console.log('update is completed!'));
      } else if (partnerLocationType === 'tourist-attraction') {
        Promise.all([
          saveTouristAttraction(updatedLocation),
          ticketList.map((ticket) => updateTicket(ticket))
        ]).then(() => console.log('update is completed!'));
      }
      navigate(`/partner-profile/${partnerId}`);
    } catch (e) {
      console.error(`failed to update partner location ${e}`);
    }
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
                onChange={(e) => onRestaurantNameChanged(e)}
              />
            </Grid>
            <Grid item>
              <TextField
                required
                id="outlined-required"
                label={phoneLabel}
                value={partnerPhoneNumber}
                onChange={(e) => onRestaurantPhoneNumberChanged(e)}
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
                onChange={(e) => onRestaurantAddressChanged(e)}
              />
            </Grid>
            <Grid item>
              <TextField
                required
                id="outlined-required"
                label={pictureLabel}
                value={partnerLocationPicture}
                onChange={(e) => onRestaurantLocationPictureChanged(e)}
              />
            </Grid>
          </Grid>
        </Grid>
        {partnerLocationType === 'restaurant' ? (
          <Stack>
            <Grid item>
              <EditRestaurantCuisineBox
                selectedItems={restaurantCuisines}
                handleChange={handleCuisineChange}
              />
            </Grid>
            <Grid item>
              <Paper style={{ maxHeight: 500, overflow: 'auto' }}>
                <List spacing={2} overflow="auto">
                  {restaurantMenuList.map((menu) => {
                    return (
                      <MenuCard
                        key={menu._id}
                        menuId={menu._id}
                        name={menu.name}
                        content={menu.description}
                        price={menu.price.toString()}
                        image={menu.image}
                        handleEditClick={handleEditClick}
                        // updateMenuList={updateMenuList}
                        inEdit
                      />
                    );
                  })}
                </List>
              </Paper>
              <EditMenuItem
                key={menuItemInEdit._id}
                item={menuItemInEdit}
                locationType={partnerLocationType}
                handleUpdateCompletionClick={handleItemChangeCompletionClick}
                inAdd={false}
                itemEditAddMode={itemEditAddMode}
              />
            </Grid>
          </Stack>
        ) : (
          <div>
            {ticketList}
            {itemEditAddMode ? (
              <EditMenuItem
                key={ticketInEdit._id}
                item={ticketInEdit}
                locationType={partnerLocationType}
                handleUpdateCompletionClick={handleUpdateCompletionClick}
                inAdd={false}
                itemEditAddMode
              />
            ) : (
              // eslint-disable-next-line react/jsx-no-useless-fragment
              <></>
            )}
          </div>
        )}
        <Grid item>
          <Button onClick={handleAddMenuItem}>Add New Menu</Button>
        </Grid>
        <Grid item>
          <Button onClick={onSubmitClicked}>Update Profile</Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default EditPartnerLocationProfilePage;
