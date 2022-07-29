import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { Button, Avatar } from '@mui/material';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import PurchaseHistoryModal from './PurchaseHistoryModal';
import { PARTNER_TYPE_RESTAURANT } from '../../shared/constants';

export default function BuyableItemCard(props) {
  const {
    itemIdx,
    buyableItem,
    handleBuyableItemEditClick,
    handleBuyableItemDeleteClick,
    partnerType,
    viewMode
  } = props;

  const [purchaseHistoryShown, setPurchaseHistoryShown] = useState(false);

  return (
    <>
      <Card sx={{ width: '100%', marginBottom: 1 }}>
        <Grid container direction="column" marginTop={4}>
          <Grid item xs={8}>
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              display="inline-flex"
              spacing={2}
              mb={2}>
              <Grid item xs={4} justifyItems="center" display="inline-grid">
                {buyableItem.image ? (
                  <Avatar
                    sx={{
                      width: '125px',
                      height: '125px'
                    }}
                    src={buyableItem.image}
                  />
                ) : (
                  <Avatar
                    sx={{
                      width: '125px',
                      height: '125px'
                    }}>
                    {partnerType === PARTNER_TYPE_RESTAURANT ? (
                      <FastfoodIcon sx={{ width: '50%', height: '50%' }} />
                    ) : (
                      <ConfirmationNumberIcon sx={{ width: '50%', height: '50%' }} />
                    )}
                  </Avatar>
                )}
              </Grid>

              <Grid item xs={3} padding="unset">
                <CardContent sx={{ padding: 'inherit' }}>
                  <Grid container direction="column">
                    <Grid item xs={8}>
                      <Typography gutterBottom variant="h6" component="div">
                        {buyableItem.name}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        {buyableItem.description}
                      </Typography>
                    </Grid>

                    <Grid item xs={2} sx={{ mb: 2 }} />

                    <Grid item xs={2} justifyContent="center">
                      <Typography variant="h5" color="text.secondary">
                        {buyableItem.price.toString()} €
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Grid>

              {!viewMode ? (
                <Grid item xs={5}>
                  <Grid container direction="row" textAlign="center">
                    <Grid item xs={3}>
                      <Button value={itemIdx} onClick={handleBuyableItemEditClick}>
                        Edit
                      </Button>
                    </Grid>

                    <Grid item xs={3}>
                      <Button value={itemIdx} onClick={handleBuyableItemDeleteClick}>
                        Delete
                      </Button>
                    </Grid>

                    <Grid item xs={3}>
                      <Button onClick={() => setPurchaseHistoryShown(true)}>Purchases</Button>
                    </Grid>

                    <Grid item xs={3} />
                  </Grid>
                </Grid>
              ) : (
                <Grid item xs={4} />
              )}
            </Grid>
          </Grid>
        </Grid>
      </Card>

      <PurchaseHistoryModal
        open={purchaseHistoryShown}
        onClose={() => setPurchaseHistoryShown(false)}
        buyableItem={buyableItem}
      />
    </>
  );
}
