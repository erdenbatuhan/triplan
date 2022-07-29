/* eslint-disable no-unused-vars */
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
  saveTouristAttraction,
  getPartnerLocationByGoogleId
} from '../queries/partner-location-queries';
import {
  getAllPartnerSignupRequests,
  removePartnerSignupRequest
} from '../queries/partner-signup-request-queries';
import { createTransaction } from '../queries/transaction-queries';
import { getUser } from '../queries/user-queries';
import { handleEmail } from '../queries/email-queries';
import {
  PARTNER_TYPE_RESTAURANT,
  PARTNER_TYPE_TOURIST_ATTRACTION,
  TRANSACTION_TYPE_WITHDRAW,
  TRANSACTION_STATUS_SUCCESSFUL,
  TRANSACTION_STATUS_REJECTED,
  BG_COLOR
} from '../shared/constants';
import { getAuthData } from '../queries/authentication-queries';
import AlertModal from '../components/common/AlertModal';

// function getWithdrawRequestRows(allWithdrawRequests) {
//   const rows = [];
//   for (let i = 0; i < allWithdrawRequests.length; i += 1) {
//     rows.push({
//       id: allWithdrawRequests[i]._id,
//       username: allWithdrawRequests[i].username,
//       userId: allWithdrawRequests[i].userId,
//       email: allWithdrawRequests[i].email,
//       paypalEmail: allWithdrawRequests[i].paypalEmail,
//       amount: allWithdrawRequests[i].amount,
//       createdAt: new Date(allWithdrawRequests[i].createdAt).toString()
//     });
//   }
//   return rows;
// }

const withdrawRequestColumns = [
  { field: 'id', headerName: 'Request ID', width: 210 },
  { field: 'username', headerName: 'User Name', width: 210 },
  { field: 'email', headerName: 'User Email', width: 210 },
  { field: 'paypalEmail', headerName: 'Paypal Account', width: 210 },
  { field: 'amount', headerName: 'Transaction Amount', type: 'number', width: 140 },
  { field: 'wallet', headerName: 'Wallet Id', type: 'number', width: 210 },
  { field: 'createdAt', headerName: 'Request Date', type: 'date', width: 600 }
];

// function getPartnerSignupRequestRows(allPartnerSignupRequests) {
//   const rows = [];
//   for (let i = 0; i < allPartnerSignupRequests.length; i += 1) {
//     getAuthData(allPartnerSignupRequests[i].authentication).then((authData) =>
//       rows.push({
//         id: allPartnerSignupRequests[i]._id,
//         username: authData.username,
//         email: authData.email,
//         googleLocationLink: allPartnerSignupRequests[i].googleLocationLink,
//         partnerLocationName: allPartnerSignupRequests[i].partnerLocationName,
//         partnerLocationContact: allPartnerSignupRequests[i].partnerLocationContact,
//         partnerType: authData.userType,
//         createdAt: new Date(allPartnerSignupRequests[i].createdAt).toString()
//       })
//     );
//   }
//   console.log('rows: ', rows);
//   return rows;
// }

const partnerSignupRequestColumns = [
  { field: 'id', headerName: 'Request ID', width: 210 },
  { field: 'username', headerName: 'User Name', width: 210 },
  { field: 'email', headerName: 'User Email', width: 210 },
  { field: 'googlePlaceId', headerName: 'Google Place ID', width: 210 },
  { field: 'partnerLocationName', headerName: 'Partner Name', width: 210 },
  { field: 'partnerLocationContact', headerName: 'Contact', width: 210 },
  { field: 'partnerType', headerName: 'Partner Type', width: 210 },
  { field: 'authentication', headerName: 'Authentication ID', width: 210 },
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

function AdminPage() {
  const [withdrawSelectedRows, setWithdrawSelectedRows] = useState();
  const [partnerSignupSelectedRows, setPartnerSignupSelectedRows] = useState();
  const [value, setValue] = useState(1);
  const [allWithdrawRequests, setAllWithdrawRequests] = useState([]);
  const [allPartnerSignupRequests, setAllPartnerSignupRequests] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccessfull, setIsSuccessfull] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [openPartnerLocWarning, setOpenPartnerLocWarning] = useState(false);
  const [curPartner, setCurPartner] = useState(null);
  const [signupRows, setSignupRows] = useState([]);
  const [withdrawRows, setWithdrawRows] = useState([]);

  const [alertCall, setAlertCall] = useState(false);

  useEffect(() => {
    getAllWithdrawRequests().then((data) => setAllWithdrawRequests(data));
  }, [isOpen]);

  const syncWithdrawRequests = () => {
    getAllWithdrawRequests().then((data) => setAllWithdrawRequests(data));
  };

  useEffect(() => {
    getAllPartnerSignupRequests().then((data) => setAllPartnerSignupRequests(data));
  }, []);

  useEffect(() => {
    setSignupRows([]);
    Promise.all([
      allPartnerSignupRequests.map(async (request) => {
        const user = await getAuthData(request.authentication);
        setSignupRows((signRows) => [
          ...signRows,
          {
            id: request._id,
            username: user.username,
            email: user.email,
            googlePlaceId: request.googlePlaceId,
            partnerLocationName: request.partnerLocationName,
            partnerLocationContact: request.partnerLocationContact,
            partnerType: user.userType,
            authentication: request.authentication,
            createdAt: new Date(request.createdAt).toString()
          }
        ]);
      })
    ]).then(() => console.log('Data is obtained'));
  }, [allPartnerSignupRequests.length]);

  useEffect(() => {
    setWithdrawRows([]);
    Promise.all([
      allWithdrawRequests.map(async (request) => {
        setWithdrawRows((signRows) => [
          ...signRows,
          {
            id: request._id,
            username: request.username,
            email: request.email,
            paypalEmail: request.paypalEmail,
            amount: request.amount,
            wallet: request.walletId,
            createdAt: new Date(request.createdAt).toString()
          }
        ]);
      })
    ]).then(() => console.log('Data is obtained'));
  }, [allWithdrawRequests]);

  const syncPartnerSignupRequests = () => {
    getAllPartnerSignupRequests().then((data) => setAllPartnerSignupRequests(data));
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleWithdrawSelection = (ids) => {
    const selectedIDs = new Set(ids);
    const selectedRowData = withdrawRows.filter((row) => selectedIDs.has(row.id));
    setWithdrawSelectedRows(selectedRowData);
  };

  const handlePartnerSignupSelection = (ids) => {
    const selectedIDs = new Set(ids);
    const selectedRowData = signupRows.filter((row) => selectedIDs.has(row.id));
    setPartnerSignupSelectedRows(selectedRowData);
  };

  const handleRejectPartnerSignupRequest = () => {
    partnerSignupSelectedRows.forEach((partner) => {
      const { id } = partner;
      removePartnerSignupRequest(id).then(() =>
        handleEmail(
          {
            subject: 'Your Partnership is Rejected!',
            to_name: partner.username,
            // to_email: partner.email,
            to_email: 'anil.kults@gmail.com',
            intro_message: `Your partnership is rejected.`,
            final_message: 'You can contact us about the problem.'
          },
          'general'
        ).then(() => {
          syncPartnerSignupRequests();
          setIsApproved(false);
          setIsSuccessfull(true);
          setIsOpen(true);
        })
      );
    });
  };

  const handleApprovePartnerSignupRequest = () => {
    partnerSignupSelectedRows.forEach((partner) => {
      const { googlePlaceId, partnerType, id } = partner;
      console.log(googlePlaceId);
      getPartnerLocationByGoogleId({ googlePlaceId, partnerType }).then((partnerData) => {
        if (partnerData.partnerLocation) {
          if (partnerType === PARTNER_TYPE_RESTAURANT) {
            saveRestaurant({
              ...partnerData.partnerLocation,
              authentication: partner.authentication
            }).then(() => {
              console.log(partner.username, ' is approved!');
              handleEmail(
                {
                  subject: 'Congratulations! Your Partnership is Approved!',
                  to_name: partner.username,
                  to_email: 'anil.kults@gmail.com', // partner.email
                  intro_message: `Your partnership is approved. Welcome to Triplan family.`,
                  final_message:
                    'You can complete your profile by logging in the system and start to meet with your customers.'
                },
                'general'
              ).then(() => {
                removePartnerSignupRequest(id).then(() => {
                  syncPartnerSignupRequests();
                  setIsSuccessfull(true);
                  setIsOpen(true);
                  setIsApproved(true);
                });
              });
            });
          } else if (partnerType === PARTNER_TYPE_TOURIST_ATTRACTION) {
            saveTouristAttraction({
              ...partnerData.partnerLocation,
              authentication: partner.authentication
            }).then(() => {
              console.log(partner.username, ' is approved!');
              handleEmail(
                {
                  subject: 'Congratulations! Your Partnership is Approved!',
                  to_name: partner.username,
                  to_email: 'anil.kults@gmail.com', // partner.email
                  intro_message: `Your partnership is approved. Welcome to Triplan family.`,
                  final_message:
                    'You can complete your profile by logging in the system and start to meet with your customers.'
                },
                'general'
              ).then(() => {
                removePartnerSignupRequest(id).then(() => {
                  syncPartnerSignupRequests();
                  setIsSuccessfull(true);
                  setIsOpen(true);
                  setIsApproved(true);
                });
              });
            });
          } else {
            console.error('the selected partner type is not defined.');
          }
        } else {
          setOpenPartnerLocWarning(true);
        }
      });
    });
  };

  const handleRejectWithdrawRequest = () => {
    withdrawSelectedRows.forEach((withdrawReq) => {
      removeWithdrawRequest(withdrawReq.id).then(() =>
        handleEmail(
          {
            subject: 'Your Withdraw Request is Rejected!',
            to_name: withdrawReq.username,
            to_email: withdrawReq.email,
            intro_message: `Your withdraw request is rejected.`,
            final_message: 'Please do not hesitate to contact about the problem.',
            details_message: 'Request Details',
            details_1: `Paypal Account: ${withdrawReq.paypalEmail}`,
            details_2: `Amount: ${withdrawReq.amount} €`,
            details_3: `Request Id: ${withdrawReq.id}`
          },
          'general'
        ).then(() => {
          syncWithdrawRequests();
          setIsApproved(false);
          setIsSuccessfull(true);
          setIsOpen(true);
        })
      );
    });
  };

  const handleApproveWithdrawRequest = () => {
    withdrawSelectedRows.forEach((withdrawReq) => {
      createTransaction({
        amount: withdrawReq.amount,
        type: TRANSACTION_TYPE_WITHDRAW,
        incomingWalletId: null,
        outgoingWalletId: withdrawReq.wallet
      }).then(({ transaction, outgoingWalletObject }) => {
        if (transaction.status === TRANSACTION_STATUS_SUCCESSFUL) {
          console.log(outgoingWalletObject);
          removeWithdrawRequest(withdrawReq.id).then(() => {
            handleEmail(
              {
                subject: 'Your Withdraw Request is Approved!',
                to_name: withdrawReq.username,
                to_email: withdrawReq.email,
                intro_message: `Your withdraw request is approved.`,
                final_message:
                  'Thanks for being part of our family. Please do not hesitate to contact with us in case of any problem.',
                details_message: 'Request Details',
                details_1: `Paypal Account: ${withdrawReq.paypalEmail}`,
                details_2: `Amount: ${withdrawReq.amount} €`,
                details_3: `Request Id: ${withdrawReq.id}`
              },
              'general'
            ).then(() => {
              syncWithdrawRequests();
              setIsApproved(true);
              setIsSuccessfull(true);
              setIsOpen(true);
            });
          });
        } else if (transaction.status === TRANSACTION_STATUS_REJECTED) {
          setIsSuccessfull(false);
          setIsOpen(true);
          setIsApproved(true);
          setAlertCall(true);
          // alert('Opps, something went wrong!');
        }
      });
    });
  };

  return (
    <Box
      sx={{
        width: '100%',
        typography: 'body1',
        padding: 1,
        height: '80vh',
        backgroundColor: BG_COLOR
      }}>
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
              rows={withdrawRows}
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
              // rows={getPartnerSignupRequestRows(allPartnerSignupRequests)}
              rows={signupRows}
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
            <Alert
              severity={isSuccessfull ? 'success' : 'error'}
              onClose={() => {
                setIsOpen(false);
                setIsSuccessfull(false);
              }}>
              <AlertTitle>{isSuccessfull ? 'Success' : 'Error'}</AlertTitle>
              {isSuccessfull
                ? `${value === 1 ? 'Withdraw' : 'Partner Signup'} request ${
                    isApproved ? 'approved' : 'rejected'
                  } successfully!`
                : `${value === 1 ? 'Withdraw' : 'Partner Signup'} request could not ${
                    isApproved ? 'approved' : 'rejected'
                  }!`}
            </Alert>
          </div>
        </Box>
      </Modal>

      <Modal
        open={openPartnerLocWarning}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{
          display: 'flex',
          justifyConent: 'center',
          alignItems: 'center'
        }}>
        <Box sx={style}>
          <div className="center">
            <Alert
              severity="warning"
              onClose={() => {
                setOpenPartnerLocWarning(false);
              }}>
              <AlertTitle>WARNING</AlertTitle>
              The Google place id can not found in your database. Please add it before approve the
              request.
            </Alert>
          </div>
        </Box>
      </Modal>

      <AlertModal
        open={alertCall}
        onCloseFunction={setAlertCall}
        message="Transaction is rejected!"
        type="error"
      />
    </Box>
  );
}

export default AdminPage;
