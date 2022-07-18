import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Grid, Typography, TextField, Button } from '@mui/material';
import { getRestaurant } from '../queries/partner-location-queries';
import EditRestaurantCuisineBox from '../components/EditRestaurantCuisineBox';
import EditRestaurantMenuItems from '../components/EditRestaurantMenuItems';

function EditRestaurantProfilePage() {
  const [restaurant, setRestaurant] = useState({});
  const [restaurantName, setRestaurantName] = useState('');
  const [restaurantAddress, setRestaurantAddress] = useState('');
  const [restaurantPhoneNumber, setRestaurantPhoneNumber] = useState('');
  const [restaurantLocationPicture, setRestaurantLocationPicture] = useState('');
  const [restaurantCuisines, setRestaurantCuisines] = useState([]);
  const [restaurantMenuList, setRestaurantMenuList] = useState([]);

  const { restaurantId } = useParams();

  useEffect(() => {
    getRestaurant(restaurantId).then((data) => {
      setRestaurant(data);
      setRestaurantCuisines(data.cuisines);
      setRestaurantMenuList(data.menuList);
    });
  }, [restaurantId]);

  useEffect(() => {
    setRestaurantName(restaurant.name);
    setRestaurantAddress(restaurant.address);
    setRestaurantPhoneNumber(restaurant.phoneNumber);
    setRestaurantLocationPicture(restaurant.locationPicture);
  }, [restaurant]);

  const onRestaurantNameChanged = (e) => {
    setRestaurantName(e.target.value);
  };
  const onRestaurantAddressChanged = (e) => {
    setRestaurantAddress(e.target.value);
  };
  const onRestaurantPhoneNumberChanged = (e) => {
    setRestaurantPhoneNumber(e.target.value);
  };
  const onRestaurantLocationPictureChanged = (e) => {
    setRestaurantLocationPicture(e.target.value);
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

  const onSubmitClicked = async () => {
    try {
      const updatedRestaurant = {
        _id: restaurantId,
        name: restaurantName,
        address: restaurantAddress,
        phoneNumber: restaurantPhoneNumber,
        locationPicture: restaurantLocationPicture,
        cuisines: restaurantCuisines,
        menuList: restaurantMenuList
      };
      console.log('updatedRestaurant: ', updatedRestaurant);
      console.log('hey!');
    } catch (e) {
      console.error(`failed to create user ${e}`);
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
          <Typography align="center">Update your restaurant profile page!</Typography>
        </Grid>
        <Grid item>
          <Grid container direction="row" justifyContent="center" alignItems="center" spacing={2}>
            <Grid item>
              <TextField
                required
                id="outlined-required"
                label="Restaurant Name"
                value={restaurantName}
                onChange={(e) => onRestaurantNameChanged(e)}
              />
            </Grid>
            <Grid item>
              <TextField
                required
                id="outlined-required"
                label="Restaurant Phone Number"
                value={restaurantPhoneNumber}
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
                label="Restaurant Address"
                value={restaurantAddress}
                onChange={(e) => onRestaurantAddressChanged(e)}
              />
            </Grid>
            <Grid item>
              <TextField
                required
                id="outlined-required"
                label="Restaurant Picture"
                value={restaurantLocationPicture}
                onChange={(e) => onRestaurantLocationPictureChanged(e)}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <EditRestaurantCuisineBox
            selectedItems={restaurantCuisines}
            handleChange={handleCuisineChange}
          />
        </Grid>
        <Grid item>
          <EditRestaurantMenuItems
            restaurantMenuList={restaurantMenuList}
            updateMenuList={setRestaurantMenuList}
          />
        </Grid>
        <Grid item>
          <Button onClick={onSubmitClicked}>Update Profile</Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default EditRestaurantProfilePage;
