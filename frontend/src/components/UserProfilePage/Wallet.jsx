import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import { Button, Box, TextField, Card, CardContent, CardActions, Grid } from '@mui/material';
import EuroIcon from '@mui/icons-material/Euro';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import ContentModal from '../common/ContentModal';
import PaypalCheckoutButtons from '../PaypalButtons';
import { UserAuthHelper } from '../../authentication/user-auth-helper';
import { findUserWallet, getUser } from '../../queries/user-queries';
import { createTransaction } from '../../queries/transaction-queries';
import { createNewWithdrawRequest } from '../../queries/withdraw-request-queries';
import { getAuthData } from '../../queries/authentication-queries';
import {
  // CURRENCIES,
  TRANSACTION_TYPE_DEPOSIT,
  TRANSACTION_TYPE_WITHDRAW,
  TRANSACTION_STATUS_SUCCESSFUL,
  TRANSACTION_STATUS_REJECTED,
  PRIMARY_COLOR
} from '../../shared/constants';
import {
  generatePaypalEmail,
  generatePaypalWithdrawAmount,
  generateIntroMessage,
  // generateRequestId,
  handleEmail
} from '../../queries/email-queries';
import TransactionHistoryModal from './TransactionHistoryModal';

export default function Wallet() {
  const [authenticatedUser] = useState(UserAuthHelper.getStoredUser());
  const [authenticatedUserData, setAuthenticatedUserData] = useState();
  const [wallet, setWallet] = useState(null);
  const [transactionAmount, setTransactionAmount] = useState(0);
  const [paypalEmail, setPaypalEmail] = useState('');
  const [isPaymentSuccessfull, setIsPaymentSuccessfull] = useState(false);
  // const [currency, setCurrency] = useState('EUR');
  const [transactionType, setTransactionType] = useState('');
  const [transactionDialogShown, setTransactionDialogShown] = useState(false);
  const [isPaymentCompleted, setPaymentCompleted] = useState(false);
  const [transitionModalShown, setTransitionModalShown] = useState(false);
  const [authData, setAuthData] = useState();

  // Listening to the changes in authenticatedUser
  useEffect(() => {
    if (!authenticatedUser) {
      return;
    }

    findUserWallet(authenticatedUser.user.id).then((data) => setWallet(data));
  }, [authenticatedUser]);

  useEffect(() => {
    if (!authenticatedUser) {
      return;
    }
    getUser(authenticatedUser.user.id).then((data) =>
      getAuthData(data.authentication).then((response) => {
        setAuthenticatedUserData(data);
        setAuthData(response);
      })
    );
  }, [authenticatedUser]);

  const handleTransaction = () => {
    if (transactionType === TRANSACTION_TYPE_DEPOSIT) {
      createTransaction({
        amount: Number(transactionAmount),
        type: transactionType,
        incomingWalletId: wallet._id,
        outgoingWalletId: null
      }).then(({ transaction, incomingWalletObject }) => {
        if (transaction.status === TRANSACTION_STATUS_SUCCESSFUL) {
          console.log('successfull');
          setWallet(incomingWalletObject);
        } else if (transaction.status === TRANSACTION_STATUS_REJECTED) {
          alert('Opps, something went wrong!');
        }
      });
    } else if (transactionType === TRANSACTION_TYPE_WITHDRAW) {
      const { _id } = authenticatedUserData;
      const { username } = authenticatedUserData;
      const { email } = authData;
      const newWithdrawRequest = {
        userId: _id,
        username,
        email,
        paypalEmail,
        amount: transactionAmount,
        walletId: authenticatedUserData.wallet
      };

      createNewWithdrawRequest(newWithdrawRequest).then(() => {
        handleEmail(
          {
            subject: 'About Your Withdraw Request',
            to_name: username,
            to_email: email,
            intro_message: generateIntroMessage('create'),
            details_message: 'Request Details:',
            details_1: generatePaypalEmail(paypalEmail),
            details_2: generatePaypalWithdrawAmount(transactionAmount),
            final_message:
              'Thanks a lot for being part of Triplan family. Please do not hasitate to contact with us in case of any problem.'
          },
          'general'
        ).then(() => {
          setIsPaymentSuccessfull(true);
          // if (response === 200) {
          //   setIsPaymentSuccessfull(true);
          // } else {
          //   setIsPaymentSuccessfull(false);
          // }
          setPaymentCompleted(true);
        });
      });

      // createTransaction({
      //   amount: Number(transactionAmount),
      //   type: transactionType,
      //   incomingWalletId: null,
      //   outgoingWalletId: wallet._id
      // }).then(({ transaction, outgoingWalletObject }) => {
      //   if (transaction.status === TRANSACTION_STATUS_SUCCESSFUL) {
      //     setWallet(outgoingWalletObject);
      //   } else if (transaction.status === TRANSACTION_STATUS_REJECTED) {
      //     alert('Opps, something went wrong!');
      //   }
      // });
    }
  };

  const handleCompletePayment = (bool) => {
    handleTransaction();
    setPaymentCompleted(bool);
    setIsPaymentSuccessfull(bool);
  };

  return (
    <div>
      <Card
        sx={{
          width: '100%',
          textAlign: 'center',
          height: '100%',
          boxShadow: 3,
          p: 1
        }}>
        <CardContent>
          <Box
            sx={{
              color: 'text.secondary',
              display: 'inline',
              mx: 0.5
            }}>
            Current balance:
          </Box>

          <Box sx={{ color: 'text.primary', fontWeight: 'bold', display: 'inline' }}>
            {wallet ? wallet.balance : 0} €
          </Box>
        </CardContent>

        <CardActions>
          <Grid container>
            <Grid item xs={2} />

            <Grid item xs={4}>
              <Button
                color="success"
                size="small"
                variant="outlined"
                onClick={() => {
                  setTransactionType(TRANSACTION_TYPE_DEPOSIT);
                  setTransactionDialogShown(true);
                }}>
                Deposit
              </Button>
            </Grid>

            <Grid item xs={4}>
              <Button
                color="error"
                size="small"
                variant="outlined"
                onClick={() => {
                  setTransactionType(TRANSACTION_TYPE_WITHDRAW);
                  setTransactionDialogShown(true);
                }}>
                Withdraw
              </Button>
            </Grid>

            <Grid item xs={2} />

            <Grid item xs={12} marginTop={4} marginBottom={2}>
              <Button size="small" variant="outlined" onClick={() => setTransitionModalShown(true)}>
                All Transactions
              </Button>

              <TransactionHistoryModal
                open={transitionModalShown}
                onClose={() => setTransitionModalShown(false)}
              />
            </Grid>
          </Grid>
        </CardActions>

        <ContentModal
          open={transactionDialogShown}
          onClose={() => setTransactionDialogShown(false)}
          contentRendered={
            <>
              <Typography variant="h6" component="h2" color="text.secondary">
                How much money would you like to {transactionType} ?
              </Typography>

              <Grid>
                <Grid
                  container
                  item
                  md={4}
                  spacing={0}
                  alignItems="center"
                  justifyContent="center"
                  sx={{
                    '& .MuiTextField-root': { m: 2, width: '25ch' }
                  }}
                  p={2}>
                  <Grid item xs={9} pr="4">
                    <TextField
                      id="standard-basic"
                      label="Please enter the amount"
                      variant="standard"
                      value={transactionAmount}
                      onChange={(event) => setTransactionAmount(event.target.value)}
                    />
                  </Grid>

                  <Grid item xs={3}>
                    <EuroIcon sx={{ pt: 2, pl: 20 }} />
                  </Grid>
                </Grid>

                <Grid
                  container
                  item
                  md={4}
                  spacing={0}
                  alignItems="center"
                  justifyContent="center"
                  sx={{
                    '& .MuiTextField-root': { width: '25ch' }
                  }}
                  p={2}>
                  {transactionType === TRANSACTION_TYPE_WITHDRAW ? (
                    <Grid item xs={9} pr="4">
                      <TextField
                        id="standard-basic"
                        label="Please enter Paypal email address"
                        variant="standard"
                        value={paypalEmail}
                        onChange={(event) => setPaypalEmail(event.target.value)}
                      />
                    </Grid>
                  ) : (
                    <div />
                  )}
                </Grid>
              </Grid>

              {transactionType === TRANSACTION_TYPE_DEPOSIT ? (
                <PayPalScriptProvider
                  options={{
                    'client-id':
                      'AX1nBcZuVJUWtiqFlkh_F4-OjQAYHoJ7KYTgGo0XJMr0Z3Uow9zJxUhj64sZceY_E3t__CeEM8w7VpMU',
                    components: 'buttons',
                    currency: 'EUR'
                  }}>
                  <PaypalCheckoutButtons
                    currency="EUR"
                    amount={transactionAmount}
                    onPaymentComplete={handleCompletePayment}
                    showSpinner
                  />
                </PayPalScriptProvider>
              ) : (
                <Button
                  style={{
                    color: '#FFFFFF',
                    backgroundColor: PRIMARY_COLOR,
                    width: '100%',
                    border: 1,
                    // borderColor: grey[500],
                    borderRadius: 4,
                    height: '60px'
                  }}
                  onClick={handleTransaction}>
                  Send Withdraw Request
                </Button>
              )}
            </>
          }
        />

        <ContentModal
          open={isPaymentCompleted}
          onClose={() => false}
          contentStyle={{
            display: 'flex',
            justifyConent: 'center',
            alignItems: 'center'
          }}
          contentRendered={
            <div className="center">
              <Alert
                severity={isPaymentSuccessfull ? 'success' : 'error'}
                onClose={() => {
                  setTransactionDialogShown(false);
                  setPaymentCompleted(false);
                }}>
                <AlertTitle>{isPaymentSuccessfull ? 'Success' : 'Error'}</AlertTitle>
                {isPaymentSuccessfull
                  ? `Your ${transactionType} process completed successfully!`
                  : `Your ${transactionType} process failed plase check your information!`}
              </Alert>
            </div>
          }
        />
      </Card>
    </div>
  );
}
