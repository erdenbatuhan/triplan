import React from 'react';
import Grid from '@mui/material/Grid';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import Typography from '@mui/material/Typography';
import EuroIcon from '@mui/icons-material/Euro';
import { Button } from '@mui/material';

function Wallet() {
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
          <Typography variant="h6">
            {' '}
            Current Balance: 60 <EuroIcon />
          </Typography>
        </Grid>
        <Grid>
          <Button variant="outlined"> Deposit </Button>
        </Grid>
        <Grid>
          <Button variant="outlined"> Withdraw </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Wallet;
