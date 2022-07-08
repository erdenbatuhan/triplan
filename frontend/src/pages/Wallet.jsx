/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import Typography from '@mui/material/Typography';
import { Button, Box, Modal, TextField, MenuItem } from '@mui/material';
import { UserAuthHelper } from '../authentication/user-auth-helper';
import { findUserWallet } from '../queries/user-queries';
import { createTransaction } from '../queries/transaction-queries';

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

const currencies = [
  {
    value: 'USD',
    label: '$'
  },
  {
    value: 'EUR',
    label: '€'
  }
];

function Wallet() {
  const [authenticatedUser] = useState(UserAuthHelper.getStoredUser());
  const [walletBalance, setWalletBalance] = useState(0);
  const [userWalletId, setUserWalletId] = useState(null);
  const [transactionAmount, setTransactionAmount] = useState(0);
  const [currency, setCurrency] = useState('EUR');
  const [type, setType] = useState('');
  const [openTransactionDialog, setOpenTransactionDialog] = useState(false);

  // Listen to the changes in authenticated user
  useEffect(() => {
    if (authenticatedUser) {
      findUserWallet(authenticatedUser.user.id).then((wallet) => {
        setWalletBalance(wallet.balance);
        setUserWalletId(wallet._id);
      });
    }
  }, [authenticatedUser, walletBalance]);

  const handleTransactionAmount = (event) => {
    setTransactionAmount(event.target.value);
  };

  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value);
  };

  const handleOpenTransactionDialog = (transactionType) => {
    setOpenTransactionDialog(true);
    setType(transactionType);
  };

  const handleCloseTransactionDialog = () => setOpenTransactionDialog(false);

  const handleTransaction = async () => {
    let incomingWalletId = null;
    let outgoingWalletId = null;

    if (type === 'Deposit') {
      incomingWalletId = userWalletId;
    } else {
      outgoingWalletId = userWalletId;
    }

    const amount = parseInt(transactionAmount, 10);

    await createTransaction({
      amount,
      type,
      incomingWalletId,
      outgoingWalletId
    });
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
          <Typography variant="h6"> Current Balance: {walletBalance} </Typography>
        </Grid>
        <Grid>
          <Button variant="outlined" onClick={() => handleOpenTransactionDialog('Deposit')}>
            {' '}
            Deposit{' '}
          </Button>
        </Grid>
        <Grid>
          <Button variant="outlined" onClick={() => handleOpenTransactionDialog('Withdraw')}>
            {' '}
            Withdraw{' '}
          </Button>
        </Grid>
      </Grid>
      <div>
        <Modal
          open={openTransactionDialog}
          onClose={handleCloseTransactionDialog}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description">
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              How much money would you like to {type} ?
            </Typography>
            <TextField
              id="standard-basic"
              label="Amount"
              variant="standard"
              value={transactionAmount}
              onChange={handleTransactionAmount}
            />
            <TextField
              id="outlined-select-currency"
              select
              label="currency"
              value={currency}
              onChange={handleCurrencyChange}>
              {currencies.map((option) => (
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

export default Wallet;
