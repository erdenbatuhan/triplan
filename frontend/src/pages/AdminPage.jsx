import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Modal, Grid } from '@mui/material';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { green, red } from '@mui/material/colors';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { getAllWithdrawRequests, removeWithdrawRequest } from '../queries/withdraw-request-queries';
import {
  getRestaurant,
  saveRestaurant,
  getTouristAttraction,
  saveTouristAttraction
} from '../queries/partner-location-queries';
import {
  getAllPartnerSignupRequests,
  removePartnerSignupRequest
} from '../queries/partner-signup-request-queries';
import { createTransaction } from '../queries/transaction-queries';
import { getUser } from '../queries/user-queries';
import { handleEmail } from '../queries/email-queries';
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

function getPartnerSignupRequestRows(allPartnerSignupRequests) {
  const rows = [];
  for (let i = 0; i < allPartnerSignupRequests.length; i += 1) {
    rows.push({
      id: allPartnerSignupRequests[i]._id,
      username: allPartnerSignupRequests[i].username,
      userId: allPartnerSignupRequests[i].userId,
      email: allPartnerSignupRequests[i].email,
      googleLocationLink: allPartnerSignupRequests[i].googleLocationLink,
      partnerLocationName: allPartnerSignupRequests[i].partnerLocationName,
      partnerLocationContact: allPartnerSignupRequests[i].partnerLocationContact,
      partnerType: allPartnerSignupRequests[i].partnerType,
      createdAt: new Date(allPartnerSignupRequests[i].createdAt).toString()
    });
  }
  return rows;
}

const partnerSignupRequestColumns = [
  { field: 'id', headerName: 'Request ID', width: 210 },
  { field: 'username', headerName: 'User Name', width: 210 },
  { field: 'userId', headerName: 'User ID', width: 210 },
  { field: 'email', headerName: 'User Email', width: 210 },
  { field: 'googleLocationLink', headerName: 'Google Maps Link', width: 210 },
  { field: 'partnerLocationName', headerName: 'Partner Name', width: 210 },
  { field: 'partnerLocationContact', headerName: 'Contact', width: 210 },
  { field: 'partnerType', headerName: 'Partner Type', width: 210 },
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
  const [withdrawSelectedRows, setWithdrawSelectedRows] = useState();
  const [partnerSignupSelectedRows, setPartnerSignupSelectedRows] = useState();
  const [value, setValue] = useState(1);
  const [allWithdrawRequests, setAllWithdrawRequests] = useState([]);
  const [allPartnerSignupRequests, setAllPartnerSignupRequests] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccessfull, setIsSuccessfull] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [curPartner, setCurPartner] = useState(null);

  useEffect(() => {
    getAllWithdrawRequests().then((data) => setAllWithdrawRequests(data));
  }, [isOpen]);
  // console.log(allWithdrawRequests);

  const syncWithdrawRequests = () => {
    getAllWithdrawRequests().then((data) => setAllWithdrawRequests(data));
  };

  useEffect(() => {
    getAllPartnerSignupRequests().then((data) => setAllPartnerSignupRequests(data));
  }, [isOpen]);
  // console.log(allWithdrawRequests);

  const syncPartnerSignupRequests = () => {
    getAllPartnerSignupRequests().then((data) => setAllPartnerSignupRequests(data));
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleWithdrawSelection = (ids) => {
    const selectedIDs = new Set(ids);

    const selectedRowData = getWithdrawRequestRows(allWithdrawRequests).filter((row) =>
      selectedIDs.has(row.id)
    );

    setWithdrawSelectedRows(selectedRowData);
  };

  const handlePartnerSignupSelection = (ids) => {
    const selectedIDs = new Set(ids);

    const selectedRowData = getPartnerSignupRequestRows(allPartnerSignupRequests).filter((row) =>
      selectedIDs.has(row.id)
    );

    setPartnerSignupSelectedRows(selectedRowData);
  };

  const handleRejectPartnerSignupRequest = () => {
    removeWithdrawRequest(partnerSignupSelectedRows[0].id).then(() =>
      handleEmail(
        {
          subject: 'Your Partnership is Rejected!',
          to_name: partnerSignupSelectedRows[0].username,
          // to_email: partnerSignupSelectedRows[0].email,
          to_email: 'anil.kults@gmail.com',
          intro_message: `Your partnership is rejected.`,
          final_message: 'You can contact us about the problem.'
        },
        'general'
      ).then(() => {
        syncWithdrawRequests();
        setIsApproved(false);
        setIsSuccessfull(true);
        setIsOpen(true);
      })
    );
  };

  const handleApprovePartnerSignupRequest = () => {
    if (partnerSignupSelectedRows[0].partnerType === 'restaurant') {
      getRestaurant(partnerSignupSelectedRows[0].userId).then((data) => {
        setCurPartner(data);
        curPartner.confirmed = 'Approved';
        saveRestaurant(curPartner).then(() =>
          handleEmail(
            {
              subject: 'Congratulations! Your Partnership is Approved!',
              to_name: partnerSignupSelectedRows[0].username,
              // to_email: partnerSignupSelectedRows[0].email,
              to_email: 'anil.kults@gmail.com',
              intro_message: `Your partnership is approved. Welcome to Triplan family.`,
              final_message:
                'You can complete your profile by logging in the system and start to meet with your customers.'
            },
            'general'
          ).then(() => {
            setIsSuccessfull(true);
            setIsOpen(true);
            removePartnerSignupRequest(partnerSignupSelectedRows[0].id).then(() => {
              syncPartnerSignupRequests();
              setIsApproved(true);
            });
          })
        );
      });
    } else {
      getTouristAttraction(partnerSignupSelectedRows[0].userId).then((data) => {
        setCurPartner(data);
        curPartner.confirmed = 'Approved';
        saveTouristAttraction(curPartner).then(() =>
          handleEmail(
            {
              subject: 'Congratulations! Your Partnership is Approved!',
              to_name: partnerSignupSelectedRows[0].username,
              // to_email: partnerSignupSelectedRows[0].email,
              to_email: 'anil.kults@gmail.com',
              intro_message: `Your partnership is approved. Welcome to Triplan family.`,
              final_message:
                'You can complete your profile by logging in the system and start to meet with your customers.'
            },
            'general'
          ).then(() => {
            setIsSuccessfull(true);
            setIsOpen(true);
            removePartnerSignupRequest(partnerSignupSelectedRows[0].id).then(() => {
              syncPartnerSignupRequests();
              setIsApproved(true);
            });
          })
        );
      });
    }
  };

  const handleRejectWithdrawRequest = () => {
    removeWithdrawRequest(withdrawSelectedRows[0].id).then(() =>
      handleEmail(
        {
          subject: 'Your Withdraw Request is Rejected!',
          to_name: withdrawSelectedRows[0].username,
          to_email: withdrawSelectedRows[0].email,
          intro_message: `Your withdraw request is rejected.`,
          final_message: 'Please do not hesitate to contact about the problem.',
          details_message: 'Request Details',
          details_1: `Paypal Account: ${withdrawSelectedRows[0].paypalEmail}`,
          details_2: `Amount: ${withdrawSelectedRows[0].amount} €`,
          details_3: `Request Id: ${withdrawSelectedRows[0].id}`
        },
        'general'
      ).then(() => {
        syncWithdrawRequests();
        setIsApproved(false);
        setIsSuccessfull(true);
        setIsOpen(true);
      })
    );
  };

  const handleApproveWithdrawRequest = () => {
    getUser(withdrawSelectedRows[0].userId).then((data) =>
      createTransaction({
        amount: Number(withdrawSelectedRows[0].amount),
        type: TRANSACTION_TYPE_WITHDRAW,
        incomingWalletId: null,
        outgoingWalletId: data.wallet
      }).then(({ transaction, outgoingWalletObject }) => {
        if (transaction.status === TRANSACTION_STATUS_SUCCESSFUL) {
          setIsSuccessfull(true);
          setIsOpen(true);
          console.log(outgoingWalletObject);
          removeWithdrawRequest(withdrawSelectedRows[0].id).then(() => {
            syncWithdrawRequests().then(() => {
              handleEmail(
                {
                  subject: 'Your Withdraw Request is Approved!',
                  to_name: withdrawSelectedRows[0].username,
                  to_email: withdrawSelectedRows[0].email,
                  intro_message: `Your withdraw request is approved.`,
                  final_message:
                    'Thanks for being part of our family. Please do not hesitate to contact with us in case of any problem.',
                  details_message: 'Request Details',
                  details_1: `Paypal Account: ${withdrawSelectedRows[0].paypalEmail}`,
                  details_2: `Amount: ${withdrawSelectedRows[0].amount} €`,
                  details_3: `Request Id: ${withdrawSelectedRows[0].id}`
                },
                'general'
              ).then(() => {
                setIsApproved(true);
              });
            });
          });
        } else if (transaction.status === TRANSACTION_STATUS_REJECTED) {
          setIsSuccessfull(false);
          setIsOpen(true);
          setIsApproved(true);
          alert('Opps, something went wrong!');
        }
      })
    );
  };

  console.log(value === 1, value);

  return (
    <Box sx={{ width: '100%', typography: 'body1', padding: 1, height: '80vh' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Withdraw Requests" value={1} />
            <Tab label="Partner Location Signup Request" value={2} />
          </TabList>
        </Box>
        <TabPanel value={1}>
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
                handleWithdrawSelection(ids);
              }}
            />
          </Box>
        </TabPanel>
        <TabPanel value={2}>
          <Box
            sx={{
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
              height: '60vh',
              padding: 2
            }}>
            <DataGrid
              rows={getPartnerSignupRequestRows(allPartnerSignupRequests)}
              columns={partnerSignupRequestColumns}
              checkboxSelection
              onSelectionModelChange={(ids) => {
                handlePartnerSignupSelection(ids);
              }}
            />
          </Box>
        </TabPanel>
      </TabContext>
      <Box textAlign="center">
        <Grid container direction="row" spacing={4}>
          <Grid item xs={6}>
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
              onClick={
                value === 1 ? handleApproveWithdrawRequest : handleApprovePartnerSignupRequest
              }>
              Approve
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              style={{
                color: '#FFFFFF',
                backgroundColor: red[500],
                width: '60%',
                border: 1,
                // borderColor: grey[500],
                borderRadius: 4,
                height: '60px'
              }}
              onClick={
                value === 1 ? handleRejectWithdrawRequest : handleRejectPartnerSignupRequest
              }>
              Reject
            </Button>
          </Grid>
        </Grid>
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
                ? `${value === 1 ? 'Withdraw' : 'Partner Signup'} request ${
                    isApproved ? 'approved' : 'rejected'
                  } successfully!`
                : `${value === 1 ? 'Withdraw' : 'Partner Signup'} request could not ${
                    isApproved ? 'approved' : 'rejected'
                  }!`}
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
