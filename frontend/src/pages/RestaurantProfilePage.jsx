import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useParams } from 'react-router-dom';
import { List } from '@mui/material';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import MenuCard from '../components/RestaurantProfilePage/MenuCard';
import { getRestaurant, getRestaurantCuisine } from '../queries/restaurant-queries';

const mockImgData = {
  img: 'https://fastly.4sqi.net/img/general/width960/41222779_zbo5pj_DAblB24yPU--MnDvDmIlvqIGLuBkc8hZxmyY.jpg',
  title: ''
};

// const fakedata = {
//   name: 'Drunken Cow',
//   address: 'Gabelsbergerstraße 58, 80333 München',
//   phone: '089 54356230',
//   price_level: '€€',
//   cusines: ['Fast Food', 'Mexican']
// };

// const fakeData = {
//   _id: '62b9b99ebdc6cf4735babce2',
//   name: 'anil',
//   password: '',
//   city: 'Munich',
//   country: 'Germany',
//   address: 'Gabelsbergerstraße 58, 80333 München',
//   phoneNumber: '089 54356230',
//   googleLocationLink: '',
//   certificate: '',
//   locationPicture:
//     'https://fastly.4sqi.net/img/general/width960/41222779_zbo5pj_DAblB24yPU--MnDvDmIlvqIGLuBkc8hZxmyY.jpg',
//   priceLevel: '€€',
//   cuisine: ['Fast Food', 'Mexican'],
//   foodType: ''
// };

const mockMenuData = [
  {
    name: 'Big Burger Menu',
    content: 'Double Burger 300g, Soft Drink, Fries',
    price: '22 €',
    img_url:
      'https://bigburger.ch/zuerich-langstrasse/wp-content/uploads/sites/16/2017/05/classic-big-burger-1-300x200.jpg'
  },
  {
    name: 'Small Burger Menu',
    content: 'Mini Burger 150g, Soft Drink, Fries',
    price: '15 €',
    img_url: 'https://i1.wp.com/www.mettsalat.de/wp-content/uploads/2008/11/mini-burger-1.jpg?ssl=1'
  },
  {
    name: 'Big Burger Menu',
    content: 'Double Burger 300g, Soft Drink, Fries',
    price: '22 €',
    img_url:
      'https://bigburger.ch/zuerich-langstrasse/wp-content/uploads/sites/16/2017/05/classic-big-burger-1-300x200.jpg'
  },
  {
    name: 'Small Burger Menu',
    content: 'Mini Burger 150g, Soft Drink, Fries',
    price: '15 €',
    img_url: 'https://i1.wp.com/www.mettsalat.de/wp-content/uploads/2008/11/mini-burger-1.jpg?ssl=1'
  }
];

// const restaurantReqBody = { id: '62c254155fa859f48d8ad7e3' };

export default function RestaurantProfilePage() {
  const [restaurant, setRestaurant] = useState({});
  const [cl, setCusines] = useState([]);

  const { restaurantId } = useParams();
  console.log(restaurantId);
  useEffect(() => {
    getRestaurant(restaurantId).then((data) => setRestaurant(data));
    getRestaurantCuisine(restaurantId).then((data) => setCusines(data));
  }, [restaurantId]);
  console.log(restaurant);
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
        <Button variant="contained">Edit Profile</Button>
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

            {cl.map((c) => (
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
            <List spacing={2} maxHeight="%100" overflow="auto">
              {mockMenuData.map((menu) => {
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
      </Grid>
    </Grid>
  );
}
