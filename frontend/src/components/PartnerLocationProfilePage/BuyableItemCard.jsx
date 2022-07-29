import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { Button, Avatar } from '@mui/material';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import { PARTNER_TYPE_RESTAURANT } from '../../shared/constants';

export default function BuyableItemCard(props) {
  const {
    itemIdx,
    name,
    content,
    price,
    image,
    handleBuyableItemEditClick,
    handleBuyableItemDeleteClick,
    partnerType,
    viewMode
  } = props;

  return (
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
              {image ? (
                <Avatar
                  sx={{
                    width: '125px',
                    height: '125px'
                  }}
                  src={image}
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
            <Grid item xs={4} padding="unset">
              <CardContent sx={{ padding: 'inherit' }}>
                <Grid container direction="column">
                  <Grid item xs={8}>
                    <Typography gutterBottom variant="h6" component="div">
                      {name}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      {content}
                    </Typography>
                  </Grid>

                  <Grid item xs={2} sx={{ mb: 2 }} />

                  <Grid item xs={2} justifyContent="center">
                    <Typography variant="h5" color="text.secondary">
                      {price} €
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Grid>

            {!viewMode ? (
              <Grid item xs={4}>
                <Button value={itemIdx} onClick={handleBuyableItemEditClick}>
                  Edit
                </Button>

                <Button value={itemIdx} onClick={handleBuyableItemDeleteClick}>
                  Delete
                </Button>
              </Grid>
            ) : (
              <Grid item xs={4} />
            )}
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
}
