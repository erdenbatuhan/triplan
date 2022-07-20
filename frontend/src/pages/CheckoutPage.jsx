import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
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
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import emailjs from '@emailjs/browser';
import Header from '../components/Header';
import CheckoutItemCard from '../components/CheckoutItemCard';
import PaypalCheckoutButtons from '../components/PaypalButtons';
import { UserAuthHelper } from '../authentication/user-auth-helper';
import { findUserWallet, getUser } from '../queries/user-queries';
import { getBuyableItems } from '../queries/buyable-item-queries';

import {
  PARTNER_LOCATION_TYPE_RESTAURANT,
  PARTNER_LOCATION_TYPE_TOURIST_ATTRACTION
} from '../shared/constants';

const emailjsCredentials = require('../credentials/emailjs_credentials.json');

function generateEmailMessage(partnerLocationList, servicesToBeBought, amount) {
  let message =
    'Your optimized route plan is consist of following places. You can also click the link below to see the route on google maps.\r\n';
  let googleMapsLink = 'https://www.google.com/maps/dir/';
  for (let index = 0; index < partnerLocationList.length; index += 1) {
    const loc = partnerLocationList[index];
    message = message.concat('\r\n- ', loc.partnerLocation.name);
    googleMapsLink = googleMapsLink.concat(loc.partnerLocation.name.replaceAll(' ', '+'), '/');
  }
  if (servicesToBeBought.length > 0) {
    message = message.concat('\r\nYour Paid Services:\r\n');
    for (let index = 0; index < servicesToBeBought.length; index += 1) {
      const item = servicesToBeBought[index];
      message = message.concat('\r\n- ', item.partnerLocation.name);
      for (let j = 0; j < item.itemsToBeBought.length; j += 1) {
        message = message.concat(
          '\r\n\r\t- ',
          `${item.itemsToBeBought[j].name} (${item.itemsToBeBought[j].price} €) x ${item.itemsToBeBought[j].count} = ${item.itemsToBeBought[j].finalPrice} €`
        );
      }
      googleMapsLink = googleMapsLink.concat(item.partnerLocation.name.replaceAll(' ', '+'), '/');
    }
    message = message.concat('\r\n- Total paid amount : ', amount, '€');
  }

  message = message.concat('\r\n\r\nGoogle Maps Link:\r\n');
  message = message.concat(googleMapsLink);
  return message;
}

export default function CheckoutPage() {
  const { state } = useLocation(); // Received from the previous route

  const [loading, setLoading] = useState(false);
  const [authenticatedUser] = useState(UserAuthHelper.getStoredUser());
  const [wallet, setWallet] = useState(null);
  const [partnerLocations] = useState(state ? state.partnerLocations : []);
  const [buyableItemData, setBuyableItemData] = useState({});
  const [buyableItemSelections, setBuyableItemSelections] = useState({});
  const [latestSelectionUpdateDate, setLatestSelectionUpdateDate] = useState(new Date()); // Used for easier force-rendering
  const [servicesToBeBought, setServicesToBeBought] = useState([]);
  const [totalPaidServicePrice, setTotalPaidServicePrice] = useState([]);
  const [user, setUser] = useState(null);
  const [emailContent] = useState({});
  const [itemList, setItemList] = useState([]);
  const [isPaymentCompleted, setPaymentCompleted] = useState(false);

  const handleCompletePayment = (bool) => {
    setPaymentCompleted(bool);
  };

  const handleEmail = () => {
    emailjs.init(emailjsCredentials.publicKey);
    // e.preventDefault(); // Prevents default refresh by the browser
    emailjs
      .send(
        emailjsCredentials.userId,
        emailjsCredentials.templeteId,
        emailContent
        // emailjs.publicKey
      )
      .then(
        (result) => {
          console.log('Message Sent, We will get back to you shortly', result.text);
        },
        (error) => {
          console.log('An error occurred, Please try again', error.text);
        }
      );
  };

  // Listen to the changes in authenticated user
  useEffect(() => {
    if (!authenticatedUser) {
      return;
    }
    findUserWallet(authenticatedUser.user.id).then((data) => setWallet(data));
  }, [authenticatedUser]);

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
        setLatestSelectionUpdateDate(new Date()); // Forces re-rendering
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

    // Calculate the total paid service price using the services to be bought
    const totalPrice = updatedServicesToBeBought.reduce(
      (accumTotalPrice, { itemsToBeBought }) =>
        accumTotalPrice +
        itemsToBeBought.reduce(
          (accumLocationPrice, item) => accumLocationPrice + item.finalPrice,
          0 // Initial value
        ),
      0 // Initial value
    );
    setTotalPaidServicePrice(totalPrice);
  }, [buyableItemSelections]);

  useEffect(() => {
    if (!user) {
      return;
    }
    emailContent.to_name = (user.firstName, ' ', user.lastName);
    emailContent.to_email = user.email;
  }, [user]);

  useEffect(() => {
    if (!partnerLocations) {
      return;
    }
    setItemList(servicesToBeBought);
    emailContent.message = generateEmailMessage(partnerLocations, itemList, totalPaidServicePrice);
  }, [partnerLocations, servicesToBeBought, totalPaidServicePrice]);

  useEffect(() => {
    if (!authenticatedUser) {
      return;
    }
    getUser(authenticatedUser.user.id).then((data) => {
      setUser(data);
    });
  }, [authenticatedUser]);

  useEffect(() => {
    if (!user) {
      return;
    }
    emailContent.to_name = (user.firstName, ' ', user.lastName);
    emailContent.to_email = user.email;
  }, [user]);

  useEffect(() => {
    if (isPaymentCompleted) {
      handleEmail();
    }
  }, [isPaymentCompleted]);

  const handleItemSelectionCountChange = ({ partnerLocationId, updatedItemSelections }) => {
    setBuyableItemSelections({
      ...buyableItemSelections,
      [partnerLocationId]: updatedItemSelections // Add the updated selections to the object
    });
    setLatestSelectionUpdateDate(new Date()); // Forces re-rendering
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
                      onItemSelectionChange={handleItemSelectionCountChange}
                      latestSelectionUpdateDate={latestSelectionUpdateDate}
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

                      <Box
                        sx={{
                          bgcolor: 'background.paper',
                          boxShadow: 1,
                          borderRadius: 2,
                          p: 2,
                          minWidth: 300
                        }}>
                        <Box sx={{ color: 'text.secondary' }}> Total </Box>

                        <Box sx={{ color: 'text.primary', fontSize: 34, fontWeight: 'medium' }}>
                          {totalPaidServicePrice} €
                        </Box>

                        {wallet && wallet.balance ? (
                          <div>
                            <Box
                              sx={{
                                color: `${
                                  totalPaidServicePrice <= wallet.balance ? 'success' : 'error'
                                }.dark`,
                                display: 'inline',
                                fontWeight: 'bold',
                                mx: 0.5,
                                fontSize: 14
                              }}>
                              {Number(
                                ((totalPaidServicePrice / wallet.balance) * 100).toPrecision(4)
                              )}
                              %
                            </Box>
                            <Box sx={{ color: 'text.secondary', display: 'inline', fontSize: 14 }}>
                              of your wallet balance
                            </Box>
                          </div>
                        ) : (
                          []
                        )}
                      </Box>
                    </CardContent>
                  </Box>
                </Card>
              </ul>
            </li>
          </List>
          <PayPalScriptProvider
            options={{
              'client-id':
                'AX1nBcZuVJUWtiqFlkh_F4-OjQAYHoJ7KYTgGo0XJMr0Z3Uow9zJxUhj64sZceY_E3t__CeEM8w7VpMU',
              components: 'buttons',
              currency: 'EUR'
            }}>
            <PaypalCheckoutButtons
              currency="EUR"
              amount={totalPaidServicePrice}
              partnerLocationList={partnerLocations}
              servicesToBeBought={servicesToBeBought}
              onPaymentComplete={handleCompletePayment}
              showSpinner
            />
          </PayPalScriptProvider>
        </Grid>

        <Grid item xs={1} />
      </Grid>
    </div>
  );
}
