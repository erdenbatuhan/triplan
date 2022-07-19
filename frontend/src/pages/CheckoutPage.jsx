import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import CircleIcon from '@mui/icons-material/Circle';
import Header from '../components/Header';
import CheckoutItemCard from '../components/CheckoutItemCard';
import { getRestaurant, getTouristAttraction } from '../queries/partner-location-queries';
import { getBuyableItems } from '../queries/buyable-item-queries';
import {
  PARTNER_LOCATION_TYPE_RESTAURANT,
  PARTNER_LOCATION_TYPE_TOURIST_ATTRACTION
} from '../shared/constants';

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [partnerLocations, setPartnerLocations] = useState([]); // Received from the previous route
  const [buyableItemData, setBuyableItemData] = useState({});
  const [buyableItemSelections, setBuyableItemSelections] = useState({});
  const [latestSelectionUpdate, setLatestSelectionUpdate] = useState(new Date()); // Used for easier force-rendering
  const [servicesToBeBought, setServicesToBeBought] = useState([]); // Used for easier force-rendering

  /**
   * TODO (REMOVE): The following (useEffect) is for mock data, remove when we start receiving partnerLocations from router
   */
  useEffect(() => {
    setLoading(true);
    Promise.all([
      ...['62d198b7fda6931f82955a91'].map((restaurantId) =>
        getRestaurant(restaurantId).then((restaurant) => ({
          partnerLocation: restaurant,
          partnerLocationType: PARTNER_LOCATION_TYPE_RESTAURANT
        }))
      ),
      ...['62c24fb87531ca1793429c7b', '62c24fb87531ca1793429c7f'].map((touristAttractionId) =>
        getTouristAttraction(touristAttractionId).then((touristAttraction) => ({
          partnerLocation: touristAttraction,
          partnerLocationType: PARTNER_LOCATION_TYPE_TOURIST_ATTRACTION
        }))
      )
    ])
      .then((data) => setPartnerLocations(data))
      .finally(() => setLoading(false));
  }, []);

  // Listen to the changes in partnerLocationData
  useEffect(() => {
    // Request body needed to get the buyable items
    const selectedPartnerLocationIds = {
      restaurantIds: partnerLocations
        .filter(({ partnerLocationType }) => {
          return partnerLocationType === PARTNER_LOCATION_TYPE_RESTAURANT;
        })
        .map(({ partnerLocation }) => partnerLocation._id),
      touristAttractionIds: partnerLocations
        .filter(({ partnerLocationType }) => {
          return partnerLocationType === PARTNER_LOCATION_TYPE_TOURIST_ATTRACTION;
        })
        .map(({ partnerLocation }) => partnerLocation._id)
    };

    setLoading(true);
    getBuyableItems(selectedPartnerLocationIds)
      .then(({ menuItemData, ticketData }) => {
        const fetchedBuyableItemData = { ...menuItemData, ...ticketData };
        const emptyBuyableItemSelections = {};

        partnerLocations.forEach(({ partnerLocation }) => {
          emptyBuyableItemSelections[partnerLocation._id] = Object.assign(
            {},
            ...fetchedBuyableItemData[partnerLocation._id].map((item) => ({ [item._id]: 0 }))
          );
        });

        setBuyableItemData(fetchedBuyableItemData);
        setBuyableItemSelections(emptyBuyableItemSelections);
        setLatestSelectionUpdate(new Date()); // Forces re-rendering
      })
      .finally(() => {
        setLoading(false);
      });
  }, [partnerLocations]);

  // Listen to the changes in buyableItemSelections
  useEffect(() => {
    // After each selection, calculate the services ready to be bought
    const updatedServicesToBeBought = [];

    partnerLocations.forEach(({ partnerLocation }) => {
      const buyableItems = buyableItemData[partnerLocation._id];
      const itemsToBeBought = [];

      // The case where the buyable items are not fetched yet
      if (!buyableItems) {
        return;
      }

      buyableItems.forEach((item) => {
        const itemSelectionCount = buyableItemSelections[partnerLocation._id][item._id];

        // If the item has not been selected
        if (!itemSelectionCount) {
          return;
        }

        // Add item to the items to be bought of the current partner location
        itemsToBeBought.push({
          ...item,
          ...{
            count: itemSelectionCount,
            finalPrice: item.price * itemSelectionCount
          } // Add some additional fields to be shown to the user
        });
      });

      // Add the items for the current partner location if "at least one" item is selected
      if (itemsToBeBought.length > 0) {
        updatedServicesToBeBought.push({ partnerLocation, itemsToBeBought });
      }
    });

    setServicesToBeBought(updatedServicesToBeBought);
  }, [buyableItemSelections]);

  const handleItemSelectionCountChange = ({ partnerLocationId, updatedItemSelections }) => {
    setBuyableItemSelections({
      ...buyableItemSelections,
      [partnerLocationId]: updatedItemSelections // Add the updated selections to the object
    });
    setLatestSelectionUpdate(new Date()); // Forces re-rendering
  };

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={1} />

        <Grid item xs={6}>
          <Header title="Your Optimized Route Plan" />

          <List
            sx={{
              width: '100%',
              bgcolor: 'background.paper',
              position: 'relative',
              overflow: 'auto',
              height: '50em',
              '& ul': { padding: 0 }
            }}>
            {partnerLocations
              .filter(({ partnerLocation }) => partnerLocation)
              .map(({ partnerLocation, partnerLocationType }, idx) => (
                <li key={`CheckoutPage-CheckoutItemCard-${partnerLocation._id}`}>
                  <ul>
                    <CheckoutItemCard
                      loading={loading}
                      index={idx + 1}
                      partnerLocation={partnerLocation}
                      partnerLocationType={partnerLocationType}
                      items={buyableItemData[partnerLocation._id] || []}
                      itemSelections={buyableItemSelections[partnerLocation._id] || []}
                      latestSelectionUpdate={latestSelectionUpdate}
                      onItemSelectionChange={handleItemSelectionCountChange}
                    />
                  </ul>
                </li>
              ))}
          </List>
        </Grid>

        <Grid item xs={4}>
          <Header title="Paid Services" />

          <List
            sx={{
              width: '100%',
              bgcolor: 'background.paper',
              position: 'relative',
              overflow: 'auto',
              height: '50em',
              '& ul': { padding: 0 }
            }}>
            <li>
              <ul>
                <Card sx={{ display: 'flex', margin: '10px' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                    <CardContent sx={{ flex: '1 0 auto' }}>
                      <List
                        sx={{
                          width: '100%',
                          bgcolor: 'background.paper',
                          position: 'relative',
                          overflow: 'auto',
                          height: '30em',
                          '& ul': { padding: 0 }
                        }}
                        subheader={<li />}>
                        {servicesToBeBought.map(({ partnerLocation, itemsToBeBought }) => (
                          <li
                            key={`CheckoutPage-SelectedPaidServices-Parent-${partnerLocation._id}`}>
                            <ul>
                              <ListSubheader sx={{ fontWeight: 500 }}>
                                {partnerLocation.name}
                              </ListSubheader>

                              {itemsToBeBought.map((itemToBeBought) => {
                                return (
                                  <ListItem
                                    key={`CheckoutPage-SelectedPaidServices-Child-${itemToBeBought._id}`}>
                                    <ListItemIcon sx={{ minWidth: '2em' }}>
                                      <CircleIcon sx={{ fontSize: '1em' }} />
                                    </ListItemIcon>

                                    <ListItemText
                                      primary={`${itemToBeBought.name} (${itemToBeBought.price} €) x ${itemToBeBought.count} = ${itemToBeBought.finalPrice} €`}
                                    />
                                  </ListItem>
                                );
                              })}
                            </ul>
                          </li>
                        ))}
                      </List>
                    </CardContent>
                  </Box>
                </Card>
              </ul>
            </li>
          </List>
        </Grid>

        <Grid item xs={1} />
      </Grid>
    </div>
  );
}
