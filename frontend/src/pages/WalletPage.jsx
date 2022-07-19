import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import Typography from '@mui/material/Typography';
import { Button, Box, Modal, TextField, MenuItem } from '@mui/material';
import { UserAuthHelper } from '../authentication/user-auth-helper';
import { findUserWallet } from '../queries/user-queries';
import { createTransaction } from '../queries/transaction-queries';
import {
  CURRENCIES,
  TRANSACTION_TYPE_DEPOSIT,
  TRANSACTION_TYPE_WITHDRAW
} from '../shared/constants';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
};

export default function WalletPage() {
  const [authenticatedUser] = useState(UserAuthHelper.getStoredUser());
  const [wallet, setWallet] = useState(null);
  const [transactionAmount, setTransactionAmount] = useState(0);
  const [currency, setCurrency] = useState('EUR');
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
      }).then(({ incoming }) => setWallet(incoming));
    } else if (transactionType === TRANSACTION_TYPE_WITHDRAW) {
      createTransaction({
        amount: Number(transactionAmount),
        type: transactionType,
        incomingWalletId: null,
        outgoingWalletId: wallet._id
      }).then(({ outgoing }) => setWallet(outgoing));
    }
  };

  return (
    <Grid container>
      <Grid container item md={4}>
        <Grid item xs={3}>
          <AccountBalanceWalletIcon style={{ fontSize: 100 }} />
        </Grid>
        <Grid item xs={9} display="flex" justifyContent="left">
          <Typography variant="h3"> My Wallet</Typography>
        </Grid>
        <Grid>
          <Typography variant="h6"> Current Balance: {wallet ? wallet.balance : 0} </Typography>
        </Grid>
        <Grid>
          <Button
            variant="outlined"
            onClick={() => {
              setTransactionType(TRANSACTION_TYPE_DEPOSIT);
              setTransactionDialogShown(true);
            }}>
            Deposit
          </Button>
        </Grid>
        <Grid>
          <Button
            variant="outlined"
            onClick={() => {
              setTransactionType(TRANSACTION_TYPE_WITHDRAW);
              setTransactionDialogShown(true);
            }}>
            Withdraw
          </Button>
        </Grid>
      </Grid>
      <div>
        <Modal
          open={transactionDialogShown}
          onClose={() => setTransactionDialogShown(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description">
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              How much money would you like to {transactionType} ?
            </Typography>
            <TextField
              id="standard-basic"
              label="Amount"
              variant="standard"
              value={transactionAmount}
              onChange={(event) => setTransactionAmount(event.target.value)}
            />
            <TextField
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
            </TextField>
            <Button onClick={handleTransaction}> Confirm </Button>
          </Box>
        </Modal>
      </div>
    </Grid>
  );
}
