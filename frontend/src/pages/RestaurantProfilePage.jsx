import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { List } from '@mui/material';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import MenuCard from '../components/RestaurantProfilePage/MenuCard';
import { getRestaurant } from '../queries/partner-location-queries';

const mockImgData = {
  img: 'https://fastly.4sqi.net/img/general/width960/41222779_zbo5pj_DAblB24yPU--MnDvDmIlvqIGLuBkc8hZxmyY.jpg',
  title: ''
};

export default function RestaurantProfilePage() {
  const [restaurant, setRestaurant] = useState({});
  const [cuisineList, setCuisineList] = useState([]);
  const [menuList, setMenuList] = useState([]);

  // Fetch the restaurant for every change in restaurant ID
  const { restaurantId } = useParams();
  const navigate = useNavigate();

  const handleEditClick = () => {
    navigate(`/edit-restaurant-profile/${restaurantId}`, { state: { restaurantId } });
  };

  useEffect(() => {
    getRestaurant(restaurantId).then((data) => {
      setRestaurant(data);
      setCuisineList(data.cuisines);
      setMenuList(data.menuList);
    });
  }, [restaurantId]);

  return (
    <Grid container direction="row">
      <Grid item xs={3} container direction="column" alignItems="center">
        <Grid>
          <img
            src={`${mockImgData.img}?w=164&h=164&fit=crop&auto=format`}
            srcSet={`${mockImgData.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
            alt={mockImgData.title}
            loading="lazy"
            width={250}
            height={250}
          />
        </Grid>
        <Grid>
          <Typography variant="h6" color="text.primary">
            Address
          </Typography>
        </Grid>
        <Grid>
          <Typography variant="body1" color="text.secondary">
            {restaurant.address}
          </Typography>
        </Grid>
        <Grid>
          <Typography variant="h6" color="text.primary">
            Phone Number
          </Typography>
        </Grid>
        <Grid>
          <Typography variant="body1" color="text.secondary">
            {restaurant.phone}
          </Typography>
        </Grid>
        <Button variant="contained" onClick={handleEditClick}>
          Edit Profile
        </Button>
      </Grid>
      <Grid item xs={9} container direction="column" justifyContent="center" alignItems="center">
        <Grid container direction="row" justifyContent="center" alignItems="center">
          <Grid item xs={9}>
            <Typography gutterBottom variant="h1" component="div" align="center">
              {restaurant.name}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="h6" color="text.primary">
              Cuisines
            </Typography>

            {cuisineList.map((c) => (
              <Typography key={c} variant="body2" color="text.secondary">
                {c}
              </Typography>
            ))}

            {/* <List spacing={2} maxHeight="%100" overflow="auto">
              {cl.map((c) => {
                return (
                  <Typography key={c} variant="body2" color="text.secondary">
                    {c}
                  </Typography>
                );
              })}
            </List> */}
          </Grid>
        </Grid>
        <Grid>
          <Paper style={{ maxHeight: 500, overflow: 'auto' }}>
            <List spacing={2} overflow="auto">
              {menuList.map((menu, idx) => {
                return (
                  <MenuCard
                    // eslint-disable-next-line react/no-array-index-key
                    key={idx}
                    name={menu.name}
                    content={menu.content}
                    price={menu.price}
                    imgUrl={menu.img_url}
                  />
                );
              })}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
}
