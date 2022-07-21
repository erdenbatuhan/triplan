import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
// import { Paper, List } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ItemListDisplay from '../components/PartnerLocationProfilePage/ItemListDisplay';
import RestaurantCuisineDisplay from '../components/PartnerLocationProfilePage/RestaurantCuisineDisplay';
import { getRestaurant, getTouristAttraction } from '../queries/partner-location-queries';
import { getMenuItems, getTickets } from '../queries/buyable-item-queries';
import InfoCard from '../components/InfoCard';
// import TicketItemDisplay from '../components/RestaurantProfilePage/TicketItemsDisplay';

const mockImgData = {
  img: 'https://fastly.4sqi.net/img/general/width960/41222779_zbo5pj_DAblB24yPU--MnDvDmIlvqIGLuBkc8hZxmyY.jpg',
  title: ''
};

export default function PartnerLocationProfilePage() {
  const [partner, setPartner] = useState({});
  const [cuisineList, setCuisineList] = useState([]);
  const [menuList, setMenuList] = useState([]);
  const [ticketList, setTicketList] = useState([]);

  const location = useLocation();
  // Fetch the restaurant for every change in restaurant ID
  const { partnerId } = useParams();
  const navigate = useNavigate();
  const partnerLocationType = location.state ? location.state.partnerType : 'tourist-attraction'; // tourist-attraction // restaurant

  const handleEditClick = () => {
    navigate(`/edit-partner-profile/${partnerId}`, { state: { partnerType: partnerLocationType } });
  };

  useEffect(() => {
    if (partnerLocationType === 'restaurant') {
      getRestaurant(partnerId).then((data) => {
        setPartner(data);
        setCuisineList(data.cuisines);
      });
      getMenuItems(partnerId).then((data) => {
        setMenuList(data);
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

  return (
    <Box
      component="form"
      noValidate
      sx={{
        mt: 4,
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 5,
        minWidth: 400
      }}>
      <Grid container direction="row" spacing={8}>
        <Grid item xs={3}>
          <Stack spacing={4}>
            <img
              src={`${partner.locationPicture}?w=164&h=164&fit=crop&auto=format`}
              srcSet={`${partner.locationPicture}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
              alt={mockImgData.title}
              loading="lazy"
              width={250}
              height={250}
            />
            <InfoCard title="Address" value={partner.address} />
            <InfoCard title="Phone Number" value={partner.phoneNumber} />
            <Button variant="contained" onClick={handleEditClick}>
              Edit Profile
            </Button>
          </Stack>
        </Grid>
        <Grid item xs={9}>
          <Stack>
            <Typography variant="h1" component="div" align="center">
              {partner.name}
            </Typography>
            {partnerLocationType === 'restaurant' ? (
              <Stack>
                <RestaurantCuisineDisplay cuisineList={cuisineList} />
                <ItemListDisplay itemList={menuList} inEdit={false} />
              </Stack>
            ) : (
              <ItemListDisplay itemList={ticketList} inEdit={false} />
            )}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
