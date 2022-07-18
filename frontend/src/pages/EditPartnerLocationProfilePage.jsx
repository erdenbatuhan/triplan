import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Box, Grid, Typography, TextField, Button, Stack } from '@mui/material';
import { getRestaurant, getTouristAttraction } from '../queries/partner-location-queries';
import EditRestaurantCuisineBox from '../components/EditRestaurantCuisineBox';
import RestaurantMenuItems from '../components/RestaurantProfilePage/RestaurantMenuItems';

function EditPartnerLocationProfilePage() {
  const [partner, setPartner] = useState({});
  const [partnerName, setRestaurantName] = useState('');
  const [partnerAddress, setRestaurantAddress] = useState('');
  const [partnerPhoneNumber, setRestaurantPhoneNumber] = useState('');
  const [partnerLocationPicture, setRestaurantLocationPicture] = useState('');
  const [restaurantCuisines, setRestaurantCuisines] = useState([]);
  const [restaurantMenuList, setRestaurantMenuList] = useState([]);

  const { partnerId } = useParams();
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
        setRestaurantMenuList(data.menuList);
      });
    } else if (partnerLocationType === 'tourist-attraction') {
      getTouristAttraction(partnerId).then((data) => {
        setPartner(data);
      });
    }
    // getRestaurant(partnerId).then((data) => {
    //   setRestaurant(data);
    //   setRestaurantCuisines(data.cuisines);
    //   setRestaurantMenuList(data.menuList);
    // });
  }, [partnerId]);

  useEffect(() => {
    setRestaurantName(partner.name);
    setRestaurantAddress(partner.address);
    setRestaurantPhoneNumber(partner.phoneNumber);
    setRestaurantLocationPicture(partner.locationPicture);
  }, [partner]);

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
        _id: partnerId,
        name: partnerName,
        address: partnerAddress,
        phoneNumber: partnerPhoneNumber,
        locationPicture: partnerLocationPicture
        // cuisines: restaurantCuisines,
        // menuList: restaurantMenuList
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
              <RestaurantMenuItems restaurantMenuList={restaurantMenuList} inEdit />
            </Grid>
          </Stack>
        ) : (
          <div>Naber</div>
        )}

        <Grid item>
          <Button onClick={onSubmitClicked}>Update Profile</Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default EditPartnerLocationProfilePage;
