import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { Button, CardActionArea, CardMedia, Typography } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Tooltip from '@mui/material/Tooltip';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import CircleIcon from '@mui/icons-material/Circle';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
// import emailjs from '@emailjs/browser';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
// import Collapse from '@mui/material/Collapse';
import { grey } from '@mui/material/colors';
import Header from '../components/common/Header';
import ContentModal from '../components/common/ContentModal';
import CheckoutItemCard from '../components/CheckoutItemCard';
import PaypalCheckoutButtons from '../components/PaypalButtons';
import { UserAuthHelper } from '../authentication/user-auth-helper';
import { findUserWallet, getUser } from '../queries/user-queries';
import { getTripPlan, getLocationsOfTripPlan } from '../queries/trip-plan-queries';
import { getBuyableItems } from '../queries/buyable-item-queries';
import { createTransaction } from '../queries/transaction-queries';
import { findCouponForUser } from '../queries/coupon-queries';
import { handleEmail } from '../queries/email-queries';
import {
  PARTNER_TYPE_RESTAURANT,
  PARTNER_TYPE_TOURIST_ATTRACTION,
  // CURRENCIES,
  TRANSACTION_TYPE_WITHDRAW,
  TRANSACTION_STATUS_SUCCESSFUL,
  TRANSACTION_STATUS_REJECTED,
  // COUPON CONSTANTS
  MIN_AMOUNT_FOR_COUPON,
  DEFAULT_VALUE_OF_COUPON,
  PRIMARY_COLOR
} from '../shared/constants';

const walletImg = require('../assets/wallet-logo.png');
// const emailjsCredentials = require('../credentials/emailjs_credentials.json');

// function generateEmailMessage(partnerLocationList, servicesToBeBought, amount) {
//   let message =
//     'Your optimized route plan is consist of following places. You can also click the link below to see the route on google maps.\r\n';
//   let googleMapsLink = 'https://www.google.com/maps/dir/';
//   for (let index = 0; index < partnerLocationList.length; index += 1) {
//     const loc = partnerLocationList[index];
//     message = message.concat('\r\n- ', loc.name);
//     googleMapsLink = googleMapsLink.concat(loc.name.replaceAll(' ', '+'), '/');
//   }
//   if (servicesToBeBought.length > 0) {
//     message = message.concat('\r\nYour Paid Services:\r\n');
//     for (let index = 0; index < servicesToBeBought.length; index += 1) {
//       const item = servicesToBeBought[index];
//       message = message.concat('\r\n- ', item.partnerLocation.name);
//       for (let j = 0; j < item.itemsToBeBought.length; j += 1) {
//         message = message.concat(
//           '\r\n\r\t- ',
//           `${item.itemsToBeBought[j].name} (${item.itemsToBeBought[j].price} €) x ${item.itemsToBeBought[j].count} = ${item.itemsToBeBought[j].finalPrice} €`
//         );
//       }
//       googleMapsLink = googleMapsLink.concat(item.partnerLocation.name.replaceAll(' ', '+'), '/');
//     }
//     message = message.concat('\r\n- Total paid amount : ', amount, '€');
//   }

//   message = message.concat('\r\n\r\nGoogle Maps Link:\r\n');
//   message = message.concat(googleMapsLink);
//   return message;
// }

export default function CheckoutPage() {
  const { tripPlanId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [authenticatedUser] = useState(UserAuthHelper.getStoredUser());
  const [wallet, setWallet] = useState(null);
  const [tripPlan, setTripPlan] = useState({});
  const [partnerLocations, setPartnerLocations] = useState([]);
  const [buyableItemData, setBuyableItemData] = useState({});
  const [buyableItemSelections, setBuyableItemSelections] = useState({});
  const [latestSelectionUpdateDate, setLatestSelectionUpdateDate] = useState(new Date()); // Used for easier force-rendering
  const [servicesToBeBought, setServicesToBeBought] = useState([]);
  const [totalPaidServicePrice, setTotalPaidServicePrice] = useState([]);
  const [coupon, setCoupon] = useState(null);
  const [user, setUser] = useState(null);
  const [emailContent] = useState({});
  // const [itemList, setItemList] = useState([]);
  const [isPaymentCompleted, setPaymentCompleted] = useState(false);

  console.log(authenticatedUser);
  const handleCompletePayment = (bool) => {
    setPaymentCompleted(bool);
  };

  // const handleEmail = () => {
  //   emailjs.init(emailjsCredentials.publicKey);
  //   // e.preventDefault(); // Prevents default refresh by the browser
  //   emailjs
  //     .send(
  //       emailjsCredentials.userId,
  //       emailjsCredentials.templeteId,
  //       emailContent
  //       // emailjs.publicKey
  //     )
  //     .then(
  //       (result) => {
  //         console.log('Message Sent, We will get back to you shortly', result.text);
  //       },
  //       (error) => {
  //         console.log('An error occurred, Please try again', error.text);
  //       }
  //     );
  // };

  const handleWalletPayment = () => {
    setLoading(true);
    createTransaction({
      amount: Number(totalPaidServicePrice),
      type: TRANSACTION_TYPE_WITHDRAW,
      incomingWalletId: null,
      outgoingWalletId: wallet._id
    })
      .then(({ transaction, outgoingWalletObject }) => {
        if (transaction.status === TRANSACTION_STATUS_SUCCESSFUL) {
          setWallet(outgoingWalletObject);
          setPaymentCompleted(true);
        } else if (transaction.status === TRANSACTION_STATUS_REJECTED) {
          alert('Opps, something went wrong!');
        }
      })
      .finally(() => setLoading(false));
  };

  // Update the trip plan data for every change in trip plan ID
  useEffect(() => {
    if (!tripPlanId) {
      navigate('/');
      return;
    }

    // Fetch the trip plan itself
    getTripPlan(tripPlanId).then((data) => {
      if (data.paid) {
        alert(
          'Sorry, you have already made a purchase for this plan. Adding new services is not possible at the moment.'
        );

        navigate(-1); // Go back
        return;
      }

      setTripPlan(data);
    });

    // Fetch all the partner locations of the trip plan
    getLocationsOfTripPlan(tripPlanId)
      .then((data) =>
        setPartnerLocations(
          data.map(({ partnerLocation, tripLocation }) => ({ ...partnerLocation, tripLocation }))
        )
      )
      .catch(() => navigate('/'));
  }, [tripPlanId]);

  // Listening to the changes in authenticatedUser
  useEffect(() => {
    if (!authenticatedUser) {
      return;
    }

    getUser(authenticatedUser.user.id).then((data) => setUser(data));
    findUserWallet(authenticatedUser.user.id).then((data) => setWallet(data));
    findCouponForUser(authenticatedUser.user.id).then((data) => setCoupon(data));
  }, [authenticatedUser]);

  // Listening to the changes in partnerLocations
  useEffect(() => {
    // Request body needed to get the buyable items
    const selectedPartnerLocationIds = {
      restaurantIds: partnerLocations
        .filter(({ partnerType }) => {
          return partnerType === PARTNER_TYPE_RESTAURANT;
        })
        .map(({ _id }) => _id),
      touristAttractionIds: partnerLocations
        .filter(({ partnerType }) => {
          return partnerType === PARTNER_TYPE_TOURIST_ATTRACTION;
        })
        .map(({ _id }) => _id)
    };

    setLoading(true);
    getBuyableItems(selectedPartnerLocationIds)
      .then(({ menuItemData, ticketData }) => {
        const fetchedBuyableItemData = { ...menuItemData, ...ticketData };
        const emptyBuyableItemSelections = {};

        partnerLocations.forEach((partnerLocation) => {
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

  // Listening to the changes in buyableItemSelections
  useEffect(() => {
    // After each selection, calculate the services ready to be bought
    const updatedServicesToBeBought = [];

    partnerLocations.forEach((partnerLocation) => {
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
        updatedServicesToBeBought.push({
          partnerLocation: { _id: partnerLocation._id, name: partnerLocation.name },
          tripLocation: { _id: partnerLocation.tripLocation._id },
          itemsToBeBought
        });
      }
    });

    setServicesToBeBought(updatedServicesToBeBought);

    console.log(updatedServicesToBeBought);

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

    // setTotalPaidServicePrice(Math.max(0, totalPrice - (coupon ? coupon.value : 0)));
    console.log(totalPrice);
    setTotalPaidServicePrice(0);
  }, [buyableItemSelections, coupon]);

  // Listening to the changes in user
  useEffect(() => {
    if (!user) {
      return;
    }

    emailContent.to_name = (user.firstName, ' ', user.lastName);
    emailContent.to_email = user.email;
  }, [user]);

  // // Listening to the changes in partnerLocations, servicesToBeBought, totalPaidServicePrice
  // useEffect(() => {
  //   if (!partnerLocations) {
  //     return;
  //   }

  //   setItemList(servicesToBeBought);
  //   emailContent.message = generateEmailMessage(partnerLocations, itemList, totalPaidServicePrice);
  // }, [partnerLocations, servicesToBeBought, totalPaidServicePrice]);

  // Listening to the changes in isPaymentCompleted
  useEffect(() => {
    if (isPaymentCompleted) {
      handleEmail(
        {
          to_email: '',
          to_name: '',
          route: '',
          paid_services: '',
          total_amount: '',
          google_maps_link: ''
        },
        'checkout'
      );
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
          <Header title={`Your Optimized Route Plan for ${tripPlan.name}`} />

          <List
            sx={{
              width: '100%',
              bgcolor: 'background.paper',
              position: 'relative',
              overflow: 'auto',
              minHeight: '30em',
              height: '50em',
              '& ul': { padding: 0 }
            }}>
            {partnerLocations
              .filter((partnerLocation) => partnerLocation)
              .map((partnerLocation, idx) => (
                <li key={`CheckoutPage-CheckoutItemCard-${partnerLocation._id}`}>
                  <ul>
                    <CheckoutItemCard
                      loading={loading}
                      index={idx + 1}
                      partnerLocation={partnerLocation}
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
                          minHeight: '10em',
                          height: '25em',
                          '& ul': { padding: 0 }
                        }}
                        subheader={<li />}>
                        {servicesToBeBought.length === 0 ? (
                          <Box style={{ width: '%100', textAlign: 'center' }}>
                            <Typography gutterBottom variant="body" component="div">
                              No Paid Service Added!
                            </Typography>
                          </Box>
                        ) : (
                          <div />
                        )}
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
                        <Grid container spacing={0}>
                          <Grid item xs={8}>
                            <Box sx={{ color: 'text.secondary' }}> Total </Box>

                            <Box
                              sx={{
                                color: 'text.primary',
                                display: 'inline',
                                fontSize: 34,
                                fontWeight: 'medium'
                              }}>
                              {totalPaidServicePrice +
                                (coupon && totalPaidServicePrice > 0 ? coupon.value : 0)}
                              {' €'}
                            </Box>

                            {coupon && totalPaidServicePrice > 0 ? (
                              <Box
                                sx={{
                                  color: 'primary.main',
                                  display: 'inline',
                                  fontSize: 26,
                                  fontWeight: 'medium'
                                }}>
                                {` - ${coupon.value} € = ${totalPaidServicePrice} €`}
                              </Box>
                            ) : (
                              []
                            )}

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
                                <Box
                                  sx={{ color: 'text.secondary', display: 'inline', fontSize: 14 }}>
                                  of your wallet balance
                                </Box>
                              </div>
                            ) : (
                              []
                            )}

                            {!coupon && totalPaidServicePrice < MIN_AMOUNT_FOR_COUPON ? (
                              <div>
                                <hr />

                                <Box
                                  sx={{ color: 'text.secondary', display: 'inline', fontSize: 14 }}>
                                  Spend
                                </Box>

                                <Box
                                  sx={{
                                    color: `primary.main`,
                                    display: 'inline',
                                    fontWeight: 'bold',
                                    mx: 0.5,
                                    fontSize: 14
                                  }}>
                                  {MIN_AMOUNT_FOR_COUPON - totalPaidServicePrice} €
                                </Box>

                                <Box
                                  sx={{ color: 'text.secondary', display: 'inline', fontSize: 14 }}>
                                  more to secure your coupon!
                                </Box>
                              </div>
                            ) : (
                              []
                            )}
                          </Grid>

                          {coupon || totalPaidServicePrice >= MIN_AMOUNT_FOR_COUPON ? (
                            <Grid item xs={4}>
                              <Box>
                                {coupon ? (
                                  <Tooltip
                                    title={`The coupon you have secured in your previous trip is applied to this one! (Value: ${coupon.value} €)`}>
                                    <InsertEmoticonIcon color="primary" />
                                  </Tooltip>
                                ) : (
                                  <InsertEmoticonIcon color="primary" />
                                )}

                                <Box sx={{ color: 'text.secondary', fontSize: 14 }}>
                                  {coupon ? (
                                    `Coupon Applied!`
                                  ) : (
                                    <div>
                                      A <b>{DEFAULT_VALUE_OF_COUPON} €</b> coupon is ready for your
                                      next trip!
                                    </div>
                                  )}
                                </Box>
                              </Box>
                            </Grid>
                          ) : (
                            <Grid item xs={2} />
                          )}
                        </Grid>
                      </Box>
                    </CardContent>
                  </Box>
                </Card>
              </ul>
            </li>
          </List>
          <br />

          {totalPaidServicePrice === 0 ? (
            <div>
              {' '}
              <Card
                sx={{ width: '%100' }}
                style={{ backgroundColor: PRIMARY_COLOR, height: '4em' }}>
                <CardActionArea onClick={handleWalletPayment}>
                  <CardContent>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                      <Typography gutterBottom variant="h6" component="div" color="#FFFFFF">
                        Save Your Triplan!
                      </Typography>
                    </div>
                  </CardContent>
                </CardActionArea>
              </Card>{' '}
            </div>
          ) : (
            <div>
              {' '}
              <Card sx={{ width: '%100' }} style={{ backgroundColor: grey[300], height: '4em' }}>
                <CardActionArea onClick={handleWalletPayment}>
                  <Grid container spacing={2}>
                    <Grid item xs={2}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '4em'
                        }}>
                        <CardMedia
                          component="img"
                          sx={{ width: '2em', height: '2em' }}
                          image={walletImg}
                          alt="wallet_icon"
                        />
                      </div>
                    </Grid>

                    <Grid item xs={10}>
                      <CardContent>
                        <Typography gutterBottom variant="h6" component="div">
                          Pay with Triplan Wallet
                        </Typography>
                      </CardContent>
                    </Grid>
                  </Grid>
                </CardActionArea>
              </Card>
              <br />
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
                  onPaymentComplete={handleCompletePayment}
                  showSpinner
                />
              </PayPalScriptProvider>{' '}
            </div>
          )}
        </Grid>

        <Grid item xs={1} />
      </Grid>

      <ContentModal
        open={isPaymentCompleted}
        onClose={() => false}
        contentStyle={{
          display: 'flex',
          justifyConent: 'center',
          alignItems: 'center'
        }}
        contentRendered={
          <Box>
            <div className="center">
              <Alert severity="success">
                <AlertTitle>Success</AlertTitle>
                Your payment is successfull! <strong>Enjoy your vacation!</strong>
              </Alert>

              <Button
                alignItems="center"
                onClick={() => {
                  navigate('/main-page');
                }}>
                Continue
              </Button>
            </div>
          </Box>
        }
      />
    </div>
  );
}
