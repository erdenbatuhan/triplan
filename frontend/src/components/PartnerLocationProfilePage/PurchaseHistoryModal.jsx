import React, { useState, useEffect } from 'react';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import CircleIcon from '@mui/icons-material/Circle';
import Spinner from '../common/Spinner';
import ContentModal from '../common/ContentModal';
import { getPurchaseHistory } from '../../queries/item-bought-queries';
import { getReadableDate, getReadableMonthYearFromTimestamp } from '../../shared/date-utils';

export default function PurchaseHistoryModal({ open, onClose, buyableItem }) {
  const [isLoading, setIsLoading] = useState(false);
  const [purchaseHistory, setPurchaseHistory] = useState({});

  // Listening to the change in buyableItem
  useEffect(() => {
    setIsLoading(true);
    getPurchaseHistory(buyableItem)
      .then((data) => {
        const purchaseHistoryByMonth = {};

        data.forEach((item) => {
          const month = getReadableMonthYearFromTimestamp(item.createdAt);

          if (!purchaseHistoryByMonth[month]) {
            purchaseHistoryByMonth[month] = [];
          }

          purchaseHistoryByMonth[month].push(item);
        });

        setPurchaseHistory(purchaseHistoryByMonth);
      })
      .finally(() => setIsLoading(false));
  }, [buyableItem]);

  // const getPurchaseInfoText = ({ user, amount, createdAt }) => {
  //   const buyer =
  //     user.firstName && user.lastName
  //       ? `${user.firstName} ${user.lastName} (@${user.username})`
  //       : user.username;
  //   return `${buyer} has bought ${amount} pieces of this item on ${getReadableDate(createdAt)}`;
  // };

  return (
    <ContentModal
      open={open}
      onClose={onClose}
      contentStyle={{ minWidth: '500px' }}
      header="Purchase History"
      subtitle={buyableItem.name}
      contentRendered={
        <List
          sx={{
            width: '100%',
            minWidth: '50em',
            bgcolor: 'background.paper',
            position: 'relative',
            overflow: 'auto',
            height: '20em',
            '& ul': { padding: 0 }
          }}
          subheader={<li />}>
          {isLoading ? (
            <Spinner marginTop="2em" />
          ) : (
            Object.keys(purchaseHistory).map((month) => (
              <li key={`PurchaseHistory-${month}`}>
                <ul>
                  <ListSubheader sx={{ fontWeight: 500 }}>{month}</ListSubheader>

                  {purchaseHistory[month].map(({ _id, user, amount, createdAt }, idx) => {
                    return (
                      <ListItem key={`PurchaseHistory-${month}-${_id}-sorting_${idx}`}>
                        <ListItemIcon sx={{ minWidth: '2em' }}>
                          <CircleIcon sx={{ fontSize: '1em' }} />
                        </ListItemIcon>

                        <ListItemText
                          primary={
                            user.firstName && user.lastName
                              ? `${user.firstName} ${user.lastName} (@${user.username})`
                              : user.username
                          }
                          secondary={
                            <Typography
                              sx={{ display: 'inline' }}
                              component="span"
                              variant="body2"
                              color="text.secondary">
                              Bought <b>{amount} pieces</b> of this item on{' '}
                              <i>{getReadableDate(createdAt)}</i>
                            </Typography>
                          }
                        />
                      </ListItem>
                    );
                  })}
                </ul>
              </li>
            ))
          )}
        </List>
      }
    />
  );
}
