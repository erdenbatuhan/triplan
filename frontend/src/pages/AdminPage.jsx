import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Modal } from '@mui/material';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { green } from '@mui/material/colors';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { getAllWithdrawRequests, removeWithdrawRequest } from '../queries/withdraw-request-queries';
import { createTransaction } from '../queries/transaction-queries';
import { getUser } from '../queries/user-queries';
import {
  handleEmail,
  generateIntroMessage,
  generatePaypalWithdrawAmount,
  generateRequestId,
  generatePaypalEmail
} from '../queries/email-queries';
import {
  TRANSACTION_TYPE_WITHDRAW,
  TRANSACTION_STATUS_SUCCESSFUL,
  TRANSACTION_STATUS_REJECTED
} from '../shared/constants';

function getWithdrawRequestRows(allWithdrawRequests) {
  const rows = [];
  for (let i = 0; i < allWithdrawRequests.length; i += 1) {
    rows.push({
      id: allWithdrawRequests[i]._id,
      username: allWithdrawRequests[i].username,
      userId: allWithdrawRequests[i].userId,
      email: allWithdrawRequests[i].email,
      paypalEmail: allWithdrawRequests[i].paypalEmail,
      amount: allWithdrawRequests[i].amount,
      createdAt: new Date(allWithdrawRequests[i].createdAt).toString()
    });
  }
  return rows;
}

const withdrawRequestColumns = [
  { field: 'id', headerName: 'Request ID', width: 210 },
  { field: 'username', headerName: 'User Name', width: 210 },
  { field: 'userId', headerName: 'User ID', width: 210 },
  { field: 'email', headerName: 'User Email', width: 210 },
  { field: 'paypalEmail', headerName: 'Paypal Account', width: 210 },
  { field: 'amount', headerName: 'Transaction Amount', type: 'number', width: 140 },
  { field: 'createdAt', headerName: 'Request Date', type: 'date', width: 600 }
];

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 6,
  borderRadius: '15px'
};

// const username = 'admin';
// const password = 'admin123';
// const email = 'seba.tum2022@gmail.com';

function AdminPage() {
  const [selectedRows, setSelectedRows] = useState();
  const [value, setValue] = useState('1');
  // const [selectedUsers, setSelectedUsers] = useState({});
  const [allWithdrawRequests, setAllWithdrawRequests] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccessfull, setIsSuccessfull] = useState(false);

  useEffect(() => {
    getAllWithdrawRequests().then((data) => setAllWithdrawRequests(data));
  }, [isOpen]);
  // console.log(allWithdrawRequests);

  const syncWithdrawRequests = () => {
    getAllWithdrawRequests().then((data) => setAllWithdrawRequests(data));
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSelection = (ids) => {
    const selectedIDs = new Set(ids);

    const selectedRowData = getWithdrawRequestRows(allWithdrawRequests).filter((row) =>
      selectedIDs.has(row.id)
    );

    setSelectedRows(selectedRowData);
  };

  const handleApproveWithdrawRequest = () => {
    getUser(selectedRows[0].userId).then((data) =>
      createTransaction({
        amount: Number(selectedRows[0].amount),
        type: TRANSACTION_TYPE_WITHDRAW,
        incomingWalletId: null,
        outgoingWalletId: data.wallet
      }).then(({ transaction, outgoingWalletObject }) => {
        if (transaction.status === TRANSACTION_STATUS_SUCCESSFUL) {
          setIsSuccessfull(true);
          setIsOpen(true);
          console.log(outgoingWalletObject);
          removeWithdrawRequest(selectedRows[0].id);
          syncWithdrawRequests();
          handleEmail(
            {
              to_name: selectedRows[0].username,
              to_email: selectedRows[0].email,
              paypal_email: generatePaypalEmail(selectedRows[0].paypalEmail),
              amount: generatePaypalWithdrawAmount(selectedRows[0].amount),
              intro_message: generateIntroMessage('close'),
              request_id: generateRequestId(selectedRows[0].id)
            },
            'withdrawRequest'
          );
        } else if (transaction.status === TRANSACTION_STATUS_REJECTED) {
          setIsSuccessfull(false);
          setIsOpen(true);
          alert('Opps, something went wrong!');
        }
      })
    );
  };

  console.log(selectedRows);

  return (
    <Box sx={{ width: '100%', typography: 'body1', padding: 1, height: '80vh' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Withdraw Requests" value="1" />
            <Tab label="Partner Location Signup Request" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <Box
            sx={{
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
              height: '60vh',
              padding: 2
            }}>
            <DataGrid
              rows={getWithdrawRequestRows(allWithdrawRequests)}
              columns={withdrawRequestColumns}
              checkboxSelection
              onSelectionModelChange={(ids) => {
                handleSelection(ids);
              }}
            />
          </Box>
        </TabPanel>
        <TabPanel value="2">
          <Box
            sx={{
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
              height: '60vh',
              padding: 2
            }}>
            <DataGrid
              rows={getWithdrawRequestRows(allWithdrawRequests)}
              columns={withdrawRequestColumns}
              checkboxSelection
              onSelectionModelChange={(ids) => {
                handleSelection(ids);
              }}
            />
          </Box>
        </TabPanel>
      </TabContext>
      <Box textAlign="center">
        <Button
          style={{
            color: '#FFFFFF',
            backgroundColor: green[500],
            width: '60%',
            border: 1,
            // borderColor: grey[500],
            borderRadius: 4,
            height: '60px'
          }}
          onClick={handleApproveWithdrawRequest}>
          Approve and Close Withdraw Request
        </Button>
      </Box>

      <Modal
        open={isOpen}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{
          display: 'flex',
          justifyConent: 'center',
          alignItems: 'center'
        }}>
        <Box sx={style}>
          <div className="center">
            <Alert severity={isSuccessfull ? 'success' : 'error'}>
              <AlertTitle>{isSuccessfull ? 'Success' : 'Error'}</AlertTitle>
              {isSuccessfull
                ? `Your withdraw request approved successfully!`
                : `Your withdraw request could not approved!`}
            </Alert>

            <Button
              alignItems="center"
              onClick={() => {
                setIsOpen(false);
                setIsSuccessfull(false);
              }}>
              Continue
            </Button>
          </div>
        </Box>
      </Modal>
    </Box>
  );
}

export default AdminPage;
