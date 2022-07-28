import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import CircleIcon from '@mui/icons-material/Circle';
import ContentModal from '../common/ContentModal';
import { getLocationsOfTripPlan } from '../../queries/trip-plan-queries';
import { getItemsBoughtByTripLocations } from '../../queries/item-bought-queries';

export default function ServicesBoughtModal({ open, onClose, tripPlan }) {
  const [isLoading, setIsLoading] = useState(false);
  const [tripLocationToPlaceName, setTripLocationToPlaceName] = useState({});
  const [itemsBoughtByTripLocations, setItemsBoughtByTripLocations] = useState({});

  // Listening to the change in tripPlanId
  useEffect(() => {
    setIsLoading(true);
    getLocationsOfTripPlan(tripPlan._id)
      .then(async (locationsData) => {
        // Store a mapping from trip location id to partner location name
        const tripLocationToPlaceName_ = Object.assign(
          {},
          ...locationsData.map(({ partnerLocation, tripLocation }) => ({
            [tripLocation._id]: partnerLocation.name
          }))
        );
        setTripLocationToPlaceName(tripLocationToPlaceName_);

        // Get the items bought by the user in this trip plan
        const tripLocationIds = Object.keys(tripLocationToPlaceName_);
        await getItemsBoughtByTripLocations(tripLocationIds).then((itemsBoughtData) =>
          setItemsBoughtByTripLocations(itemsBoughtData)
        );
      })
      .finally(() => setIsLoading(false));
  }, [tripPlan]);

  return (
    <ContentModal
      open={open}
      onClose={onClose}
      contentStyle={{ minWidth: '500px' }}
      header="Services Bought"
      subtitle={tripPlan.name}
      contentRendered={
        <List
          sx={{
            width: '100%',
            bgcolor: 'background.paper',
            position: 'relative',
            overflow: 'auto',
            '& ul': { padding: 0 }
          }}>
          <li>
            {isLoading}
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
                        height: '20em',
                        '& ul': { padding: 0 }
                      }}
                      subheader={<li />}>
                      {Object.entries(itemsBoughtByTripLocations).map(
                        ([tripLocationId, itemsBought]) => (
                          <li
                            key={`ServicesBoughtCard-BoughtPaidServices-Parent-${tripLocationId}`}>
                            <ul>
                              <ListSubheader sx={{ fontWeight: 500 }}>
                                {`${tripLocationToPlaceName[tripLocationId]}${
                                  itemsBought.length === 0 ? ' (No services bought)' : ''
                                }`}
                              </ListSubheader>

                              {itemsBought.map((itemBought) => {
                                return (
                                  <ListItem
                                    key={`ServicesBoughtCard-BoughtPaidServices-Child-${itemBought._id}`}>
                                    <ListItemIcon sx={{ minWidth: '2em' }}>
                                      <CircleIcon sx={{ fontSize: '1em' }} />
                                    </ListItemIcon>

                                    <ListItemText
                                      primary={`${itemBought.name} (${itemBought.price} €) x ${
                                        itemBought.amount
                                      } = ${itemBought.price * itemBought.amount} €`}
                                    />
                                  </ListItem>
                                );
                              })}
                            </ul>
                          </li>
                        )
                      )}
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
                            {`${111} €`}
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </CardContent>
                </Box>
              </Card>
            </ul>
          </li>
        </List>
      }
    />
  );
}
