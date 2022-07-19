import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
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

  /**
   * TODO: The following is the mock data, remove when everything is connected to the backend
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
        setLatestSelectionUpdate(new Date());
      })
      .finally(() => {
        setLoading(false);
      });
  }, [partnerLocations]);

  const handleItemSelectionCountChange = ({ partnerLocationId, updatedItemSelections }) => {
    buyableItemSelections[partnerLocationId] = updatedItemSelections;

    setBuyableItemSelections(buyableItemSelections);
    setLatestSelectionUpdate(new Date());
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
            {partnerLocations.map(({ partnerLocation, partnerLocationType }, idx) => (
              <li key={`CheckoutPage-CheckoutItemCard-${partnerLocation._id}`}>
                {partnerLocation ? (
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
                ) : (
                  []
                )}
              </li>
            ))}
          </List>
        </Grid>

        <Grid item xs={4}>
          <Header title="Paid Services" />
        </Grid>

        <Grid item xs={1} />
      </Grid>
    </div>
  );
}
