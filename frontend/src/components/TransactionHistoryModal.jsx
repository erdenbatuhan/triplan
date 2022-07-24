import React, { useState, useEffect } from 'react';
import { Modal, Box, Grid, List, ListSubheader, Typography, Tooltip } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Spinner from './Spinner';
import { getPreviousTransactions } from '../queries/transaction-queries';
import { getOwnersOfWallets } from '../queries/wallet-queries';
import { getReadableDate, getReadableMonthYearFromTimestamp } from '../shared/date-utils';
import { TRANSACTION_STATUS_SUCCESSFUL, TRANSACTION_STATUS_REJECTED } from '../shared/constants';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
};

export default function TransactionHistoryModal({ open, onClose }) {
  const [authenticatedUser] = useState({
    user: { id: '62c430e748c4994b2c42af0f' }
  }); // TODO: Replace with UserAuthHelper.getStoredUser()
  const [loading, setLoading] = useState(false);
  const [walletId, setWalletId] = useState(null);
  const [previousTransactions, setPreviousTransactions] = useState([]);
  const [walletOwnerData, setWaletOwnerData] = useState({});

  // Listening to the changes in authenticatedUser
  useEffect(() => {
    if (!authenticatedUser) {
      return;
    }

    setLoading(true);
    getPreviousTransactions(authenticatedUser.user.id)
      .then(async ({ wallet, transactions }) => {
        const previousTransactionsByMonth = {};

        transactions.forEach((item) => {
          const month = getReadableMonthYearFromTimestamp(item.createdAt);

          if (!previousTransactionsByMonth[month]) {
            previousTransactionsByMonth[month] = [];
          }

          previousTransactionsByMonth[month].push(item);
        });

        setWalletId(wallet);
        setPreviousTransactions(previousTransactionsByMonth);

        // Also fetch the owners of the wallets seen in the transactions
        const distinctWalletIds = [
          ...new Set(
            [].concat.apply(
              [],
              transactions.map(({ incoming, outgoing }) => [incoming, outgoing])
            )
          )
        ];

        await getOwnersOfWallets(distinctWalletIds).then((walletOwnersResponse) =>
          setWaletOwnerData(walletOwnersResponse)
        );
      })
      .finally(() => setLoading(false));
  }, [authenticatedUser]);

  const createTableRow = (id, items) => {
    return (
      <Grid container spacing={0}>
        {items.map(({ content, size, style, icon }) => (
          <Grid key={`${id}-${content}`} sx={{ pt: !icon ? 1 : '0.35em' }} item xs={size}>
            <Typography sx={{ color: 'text.primary', ...style }} variant="body2" align="center">
              {content}
            </Typography>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ ...modalStyle }}>
        <Grid sx={{ width: '100%' }} alignItems="stretch">
          <Typography
            sx={{ color: 'text.secondary', fontWeight: 'medium', fontSize: 25, pt: 2 }}
            align="center">
            Transaction History
          </Typography>

          {loading ? (
            <Spinner marginTop="2em" />
          ) : (
            <div>
              <Grid sx={{ pt: 2 }} container spacing={0}>
                {createTableRow('TransactionHistory-TableHeader', [
                  { content: 'From', size: 2 },
                  { content: 'To', size: 2 },
                  { content: 'Date', size: 3 },
                  { content: 'Amount', size: 2 },
                  { content: 'Type', size: 2 },
                  { content: 'Status', size: 1 }
                ])}
              </Grid>

              <hr />

              <List
                sx={{
                  width: '100%',
                  minWidth: '60em',
                  bgcolor: 'background.paper',
                  position: 'relative',
                  overflow: 'auto',
                  height: '30em',
                  '& ul': { padding: 0 }
                }}
                subheader={<li />}>
                {Object.keys(previousTransactions).map((month) => (
                  <li key={`TransactionHistory-${month}`}>
                    <ul>
                      <ListSubheader sx={{ fontWeight: 500 }}>{month}</ListSubheader>

                      {previousTransactions[month].map((transaction) => {
                        return (
                          <Grid
                            key={`TransactionHistory-${month}-${transaction._id}`}
                            sx={{ width: '100%', pt: 0 }}
                            container
                            spacing={0}
                            alignItems="stretch">
                            {createTableRow(
                              `TransactionHistory-${month}-${transaction._id}-TableRow`,
                              [
                                {
                                  content: walletOwnerData[transaction.incoming] || '-',
                                  size: 2,
                                  style: {
                                    fontWeight: walletId === transaction.incoming ? 'bold' : ''
                                  }
                                },
                                {
                                  content: walletOwnerData[transaction.outgoing] || '-',
                                  size: 2,
                                  style: {
                                    fontWeight: walletId === transaction.outgoing ? 'bold' : ''
                                  }
                                },
                                {
                                  content: getReadableDate(transaction.createdAt),
                                  size: 3
                                },
                                {
                                  content: `${walletId === transaction.outgoing ? '+' : '-'} ${
                                    transaction.amount
                                  } €`,
                                  size: 2,
                                  style: {
                                    color:
                                      walletId === transaction.outgoing
                                        ? 'success.main'
                                        : 'error.main'
                                  }
                                },
                                { content: transaction.type, size: 2 },
                                {
                                  content:
                                    transaction.status === TRANSACTION_STATUS_SUCCESSFUL ? (
                                      <Tooltip title={TRANSACTION_STATUS_SUCCESSFUL}>
                                        <CheckCircleOutlineIcon />
                                      </Tooltip>
                                    ) : (
                                      <Tooltip title={TRANSACTION_STATUS_REJECTED}>
                                        <ErrorOutlineIcon />
                                      </Tooltip>
                                    ),
                                  size: 1,
                                  style: {
                                    color:
                                      transaction.status === TRANSACTION_STATUS_SUCCESSFUL
                                        ? 'success.main'
                                        : 'error.main'
                                  },
                                  icon: true
                                }
                              ]
                            )}
                          </Grid>
                        );
                      })}
                    </ul>
                  </li>
                ))}
              </List>
            </div>
          )}
        </Grid>
      </Box>
    </Modal>
  );
}
