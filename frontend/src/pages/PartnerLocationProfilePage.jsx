import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
// import { Paper, List } from '@mui/material';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import RestaurantMenuItems from '../components/RestaurantProfilePage/RestaurantMenuItems';
import RestaurantCuisineDisplay from '../components/RestaurantProfilePage/RestaurantCuisineDisplay';
import { getRestaurant, getTouristAttraction } from '../queries/partner-location-queries';
import InfoCard from '../components/InfoCard';

const mockImgData = {
  img: 'https://fastly.4sqi.net/img/general/width960/41222779_zbo5pj_DAblB24yPU--MnDvDmIlvqIGLuBkc8hZxmyY.jpg',
  title: ''
};

export default function PartnerLocationProfilePage() {
  const [partner, setPartner] = useState({});
  const [cuisineList, setCuisineList] = useState([]);
  const [menuList, setMenuList] = useState([]);
  const location = useLocation();
  // Fetch the restaurant for every change in restaurant ID
  const { partnerId } = useParams();
  const navigate = useNavigate();
  const partnerLocationType = location.state ? location.state.partnerType : 'restaurant'; // tourist-attraction

  const handleEditClick = () => {
    navigate(`/edit-partner-profile/${partnerId}`, { state: { partnerType: partnerLocationType } });
  };

  useEffect(() => {
    if (partnerLocationType === 'restaurant') {
      getRestaurant(partnerId).then((data) => {
        setPartner(data);
        setCuisineList(data.cuisines);
        setMenuList(data.menuList);
      });
    } else if (partnerLocationType === 'tourist-attraction') {
      getTouristAttraction(partnerId).then((data) => {
        setPartner(data);
        // setCuisineList(data.cuisines);
        // setMenuList(data.menuList);
      });
    }
  }, [partnerId]);

  return (
    <Grid container direction="row">
      <Grid item xs={3} container direction="column" alignItems="center">
        <Grid>
          <img
            src={`${partner.locationPicture}?w=164&h=164&fit=crop&auto=format`}
            srcSet={`${partner.locationPicture}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
            alt={mockImgData.title}
            loading="lazy"
            width={250}
            height={250}
          />
        </Grid>
        <Grid>
          <InfoCard title="Address" value={partner.address} />
        </Grid>
        <Grid>
          <InfoCard title="Phone Number" value={partner.phone} />
        </Grid>
        <Button variant="contained" onClick={handleEditClick}>
          Edit Profile
        </Button>
      </Grid>
      <Grid item xs={9} container direction="column" justifyContent="center" alignItems="center">
        <Grid container direction="row" justifyContent="center" alignItems="center">
          <Grid item xs={9}>
            <Typography gutterBottom variant="h1" component="div" align="center">
              {partner.name}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <RestaurantCuisineDisplay cuisineList={cuisineList} />
          </Grid>
        </Grid>
        {partnerLocationType === 'restaurant' ? (
          <Stack>
            <Grid item>
              <RestaurantMenuItems restaurantMenuList={menuList} inEdit={false} />
            </Grid>
          </Stack>
        ) : (
          <Stack>
            <Grid item>
              <div>Tickets Available</div>
            </Grid>
          </Stack>
        )}
      </Grid>
    </Grid>
  );
}
