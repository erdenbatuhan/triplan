import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Grid, Typography, TextField, Button, Paper, List } from '@mui/material';
import MenuCard from '../components/RestaurantProfilePage/MenuCard';
import { getRestaurant } from '../queries/partner-location-queries';

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
  const onRestaurantCuisinesChanged = (e) => {
    setRestaurantCuisines(e.target.value);
  };
  // const onRestaurantMenuListChanged = (e) => {
  //   setRestaurantMenuList(e.target.value);
  // };
  const onSubmitClicked = async () => {
    try {
      console.log('restaurant: ', restaurant);
      console.log('restaurantName: ', restaurantName);
      console.log('restaurantAddress: ', restaurantAddress);
      console.log('restaurantPhoneNumber: ', restaurantPhoneNumber);
      console.log('restaurantLocationPicture: ', restaurantLocationPicture);
      console.log('restaurantCuisines: ', restaurantCuisines);
      console.log('restaurantMenuList: ', restaurantMenuList);

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
          <TextField
            required
            id="outlined-required"
            label="Restaurant Cuisine Categories"
            value={restaurantCuisines}
            onChange={(e) => onRestaurantCuisinesChanged(e)}
          />
        </Grid>
        <Grid item>
          <Paper style={{ maxHeight: 500, overflow: 'auto' }}>
            <List spacing={2} maxHeight="%100" overflow="auto">
              {restaurantMenuList.map((menu) => {
                return (
                  <MenuCard
                    key={menu.name}
                    name={menu.name}
                    content={menu.content}
                    price={menu.price}
                    img_url={menu.img_url}
                  />
                );
              })}
            </List>
          </Paper>
        </Grid>
        <Grid item>
          <Button onClick={onSubmitClicked}>Update Profile</Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default EditRestaurantProfilePage;
