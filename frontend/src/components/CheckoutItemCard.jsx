import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import Spinner from './common/Spinner';
import { PARTNER_TYPE_RESTAURANT } from '../shared/constants';

const MAX_NUM_ITEMS_BUYABLE = 9;

export default function CheckoutItemCard({
  loading,
  index,
  partnerLocation,
  items,
  itemSelections,
  onItemSelectionChange,
  latestSelectionUpdateDate
}) {
  const [updatedItemSelections, setUpdatedItemSelections] = useState([]);

  // Listening to the changes in latestSelectionUpdate
  useEffect(() => {
    setUpdatedItemSelections(itemSelections);
  }, [latestSelectionUpdateDate]);

  const handleItemSelectionCountChange = ({ itemId, val }) => {
    // Let the parent know about the recent changes, which will also lead to an update in the updatedItemSelections in this component
    onItemSelectionChange({
      partnerLocationId: partnerLocation._id,
      updatedItemSelections: { ...updatedItemSelections, [itemId]: val } // Add the updated selections to the object
    });
  };

  return (
    <Card sx={{ display: 'flex', margin: '10px' }}>
      <CardMedia
        component="img"
        style={{
          width: 100,
          height: 100,
          flex: 1,
          borderRadius: '50%',
          margin: '10px 0 0 10px'
        }}
        image={partnerLocation.locationPicture}
      />

      <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography variant="h6">
            {index} - {partnerLocation.name}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {partnerLocation.address}
          </Typography>

          {loading ? (
            <Spinner marginTop="1.5em" />
          ) : (
            <List
              sx={{
                width: '100%',
                bgcolor: 'background.paper',
                position: 'relative',
                overflow: 'auto',
                minHeight: '1.5em',
                maxHeight: '15em',
                marginTop: '10px',
                '& ul': { padding: 0 }
              }}>
              {items
                .filter((item) => {
                  return updatedItemSelections[item._id] || updatedItemSelections[item._id] === 0;
                })
                .map((item) => (
                  <li key={`CheckoutItemCard-ListItem-${item._id}`}>
                    <ul>
                      <ListItem>
                        <ListItemAvatar>
                          {item.image ? (
                            <Avatar src={item.image} />
                          ) : (
                            <Avatar>
                              {partnerLocation.partnerType === PARTNER_TYPE_RESTAURANT ? (
                                <FastfoodIcon />
                              ) : (
                                <ConfirmationNumberIcon />
                              )}
                            </Avatar>
                          )}
                        </ListItemAvatar>

                        <Grid container spacing={0}>
                          <Grid sx={{ width: '300px' }} item xs={5}>
                            <ListItemText
                              primary={`${item.name} (${item.price} €)`}
                              secondary={item.description}
                            />
                          </Grid>

                          <Grid item xs={3}>
                            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                              <Select
                                sx={{ margin: '0px 2em' }}
                                value={updatedItemSelections[item._id]}
                                onChange={(event) => {
                                  handleItemSelectionCountChange({
                                    itemId: item._id,
                                    val: event.target.value
                                  });
                                }}>
                                {Array.apply(null, { length: MAX_NUM_ITEMS_BUYABLE + 1 }).map(
                                  (_, idx) => {
                                    return (
                                      <MenuItem
                                        key={`CheckoutItemCard-ListItem-${item._id}-idx:${idx}`}
                                        value={idx}>
                                        {idx || '-'}
                                      </MenuItem>
                                    );
                                  }
                                )}
                              </Select>
                            </FormControl>
                          </Grid>

                          <Grid item xs={2}>
                            {updatedItemSelections[item._id] ? (
                              <ListItemText
                                primary="Price:"
                                secondary={`${item.price * updatedItemSelections[item._id]} €`}
                              />
                            ) : (
                              []
                            )}
                          </Grid>

                          <Grid item xs={2} />
                        </Grid>
                      </ListItem>
                    </ul>
                  </li>
                ))}
            </List>
          )}
        </CardContent>
      </Box>
    </Card>
  );
}
