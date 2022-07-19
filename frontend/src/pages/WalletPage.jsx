import React, { useEffect, useState } from 'react';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
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
  p: 4
};

export default function WalletPage() {
  const [authenticatedUser] = useState(UserAuthHelper.getStoredUser());
  const [wallet, setWallet] = useState(null);
  const [transactionAmount, setTransactionAmount] = useState(0);
  // const [currency, setCurrency] = useState('EUR');
  const [transactionType, setTransactionType] = useState('');
  const [transactionDialogShown, setTransactionDialogShown] = useState(false);

  // Listen to the changes in authenticated user
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

  return (
    <div>
      <Grid container item md={4} spacing={0} alignItems="center" justifyContent="center">
        <Grid item xs={3}>
          <AccountBalanceWalletIcon style={{ fontSize: 100, color: ' #ffa726' }} />
        </Grid>
        <Grid item xs={9} display="flex" justifyContent="left">
          <Typography variant="h3"> My Wallet</Typography>
        </Grid>
      </Grid>
      <Card sx={{ maxWidth: 345 }}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Current Balance:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Your current balance in your wallet is <b>{wallet ? wallet.balance : 0} €</b>
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            size="small"
            variant="outlined"
            onClick={() => {
              setTransactionType(TRANSACTION_TYPE_DEPOSIT);
              setTransactionDialogShown(true);
            }}>
            Deposit
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => {
              setTransactionType(TRANSACTION_TYPE_WITHDRAW);
              setTransactionDialogShown(true);
            }}>
            Withdraw
          </Button>
        </CardActions>
        <Modal
          open={transactionDialogShown}
          onClose={() => setTransactionDialogShown(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description">
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              How much money would you like to {transactionType} ?
            </Typography>
            <div>
              <Grid container item md={4} spacing={0} alignItems="center" justifyContent="center">
                <Grid item xs={9}>
                  <TextField
                    id="standard-basic"
                    label="Amount"
                    variant="standard"
                    value={transactionAmount}
                    onChange={(event) => setTransactionAmount(event.target.value)}
                  />
                </Grid>
                <Grid item xs={3} display="flex" justifyContent="left">
                  <p>€</p>
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
            </div>
            <Button
              alignItems="right"
              onClick={() => {
                handleTransaction();
                setTransactionDialogShown(false);
                setTransactionAmount(0);
              }}>
              Confirm
            </Button>
          </Box>
        </Modal>
      </Card>
    </div>
  );
}
