import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import {
  Button,
  Box,
  Modal,
  TextField,
  // MenuItem,
  Card,
  CardContent,
  CardActions,
  Grid
} from '@mui/material';
import EuroIcon from '@mui/icons-material/Euro';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import PaypalCheckoutButtons from '../components/PaypalButtons';
import { UserAuthHelper } from '../authentication/user-auth-helper';
import { findUserWallet } from '../queries/user-queries';
import { createTransaction } from '../queries/transaction-queries';
import {
  // CURRENCIES,
  TRANSACTION_TYPE_DEPOSIT,
  TRANSACTION_TYPE_WITHDRAW,
  TRANSACTION_STATUS_SUCCESSFUL,
  TRANSACTION_STATUS_REJECTED
} from '../shared/constants';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 6,
  borderRadius: '15px'
};

export default function WalletPage() {
  const [authenticatedUser] = useState(UserAuthHelper.getStoredUser());
  const [wallet, setWallet] = useState(null);
  const [transactionAmount, setTransactionAmount] = useState(0);
  // const [currency, setCurrency] = useState('EUR');
  const [transactionType, setTransactionType] = useState('');
  const [transactionDialogShown, setTransactionDialogShown] = useState(false);
  const [isPaymentCompleted, setPaymentCompleted] = useState(false);

  // Listening to the changes in authenticatedUser
  useEffect(() => {
    if (!authenticatedUser) {
      return;
    }

    findUserWallet(authenticatedUser.user.id).then((data) => setWallet(data));
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
          setWallet(incomingWalletObject);
        } else if (transaction.status === TRANSACTION_STATUS_REJECTED) {
          alert('Opps, something went wrong!');
        }
      });
    } else if (transactionType === TRANSACTION_TYPE_WITHDRAW) {
      createTransaction({
        amount: Number(transactionAmount),
        type: transactionType,
        incomingWalletId: null,
        outgoingWalletId: wallet._id
      }).then(({ transaction, outgoingWalletObject }) => {
        if (transaction.status === TRANSACTION_STATUS_SUCCESSFUL) {
          setWallet(outgoingWalletObject);
        } else if (transaction.status === TRANSACTION_STATUS_REJECTED) {
          alert('Opps, something went wrong!');
        }
      });
    }
  };

  const handleCompletePayment = (bool) => {
    handleTransaction();
    setPaymentCompleted(bool);
  };

  return (
    <div sx={{ height: '100%', width: '100%' }}>
      <Card
        sx={{
          width: '100%',
          textAlign: 'center',
          height: '100%',
          boxShadow: 3
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
          <Grid container direction="column">
            <Grid item sx={6}>
              <Button
                color="success"
                variant="outlined"
                onClick={() => {
                  setTransactionType(TRANSACTION_TYPE_DEPOSIT);
                  setTransactionDialogShown(true);
                }}>
                Manage Balance
              </Button>
            </Grid>

            <Grid item sx={6} m={1}>
              {/* <Button
                size="small"
                variant="outlined"
                onClick={() => {
                  setTransactionType(TRANSACTION_TYPE_WITHDRAW);
                  setTransactionDialogShown(true);
                }}>
                Withdraw
              </Button> */}
            </Grid>
          </Grid>
        </CardActions>

        <Modal open={transactionDialogShown} onClose={() => setTransactionDialogShown(false)}>
          <Box sx={style}>
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
              {/* <TextField
              id="outlined-select-currency"
              select
              label="currency"
              value={currency}
              onChange={(event) => setCurrency(event.target.value)}>
              {CURRENCIES.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
              </TextField> */}
            </Grid>

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
            {/* <Button
              alignItems="right"
              onClick={() => {
                handleTransaction();
                setTransactionDialogShown(false);
                setTransactionAmount(0);
              }}>
              Confirm
            </Button> */}
          </Box>
        </Modal>

        <Modal
          open={isPaymentCompleted}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          style={{
            display: 'flex',
            justifyConent: 'center',
            alignItems: 'center'
          }}>
          <Box sx={style}>
            <div className="center">
              <Alert severity="success">
                <AlertTitle>Success</AlertTitle>
                Your payment is successfull!
              </Alert>

              <Button
                alignItems="center"
                onClick={() => {
                  setTransactionDialogShown(false);
                  setPaymentCompleted(false);
                }}>
                Continue
              </Button>
            </div>
          </Box>
        </Modal>
      </Card>
    </div>
  );
}
