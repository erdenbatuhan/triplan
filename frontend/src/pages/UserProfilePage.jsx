import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Grid,
  Stack,
  Typography,
  Avatar,
  IconButton,
  Divider,
  Card,
  CardContent,
  Box,
  Modal,
  Button
} from '@mui/material';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import Spinner from '../components/Spinner';
import TripCard from '../components/TripCard';
import Wallet from '../components/Wallet';
import { UserAuthHelper } from '../authentication/user-auth-helper';
import { getUser } from '../queries/user-queries';
import {
  getFollowingRelationship,
  createFollowingRelationship,
  deleteFollowingRelationship,
  getFollowers,
  getFollowed
} from '../queries/following-relationship-queries';
import { getNumTripsPlannedByUsers, getTripPlansOfUser } from '../queries/trip-plan-queries';
import FollowingsCard from '../components/FollowingsCard';
import { avatarStyle, appBackgroundColor, modalStyle } from '../shared/styles';
import EditUserProfileCard from '../components/EditUserProfileCard';

function UserProfilePage() {
  const { userId } = useParams();

  const [authenticatedUser] = useState(UserAuthHelper.getStoredUser());
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  const [tripPlans, setTripPlans] = useState([]);
  const [followersData, setFollowersData] = useState({});
  const [followedData, setFollowedData] = useState({});
  const [numTripsPlannedByUsers, setNumTripsPlannedByUsers] = useState([]);
  const [followersModalShown, setFollowersModalShown] = useState(false);
  const [followedModalShown, setFollowedModalShown] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [isShownUserAuthenticated, setIsShownUserAuthenticated] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const getFollowersOfUser = () => {
    return getFollowers(userId).then((data) => {
      setFollowersData(Object.assign({}, ...data.map((item) => ({ [item._id]: item }))));
      return data;
    });
  };

  const getFollowedOfUser = () => {
    return getFollowed(userId).then((data) => {
      setFollowedData(Object.assign({}, ...data.map((item) => ({ [item._id]: item }))));
      return data;
    });
  };

  const getCountText = (count, onClick) => {
    return (
      <Box
        onClick={onClick}
        sx={{
          color: 'text.primary',
          fontSize: 34,
          fontWeight: 'medium',
          '&:hover': {
            cursor: 'pointer',
            textDecoration: 'underline',
            textDecorationColor: 'cornflowerblue',
            textDecorationThickness: 'from-font'
          }
        }}>
        {count}
      </Box>
    );
  };

  const getCountTextForNonAuthenticatedUser = (count, onClick) => {
    return (
      <Box
        onClick={onClick}
        sx={{
          color: 'text.primary',
          fontSize: 34,
          fontWeight: 'medium'
        }}>
        {count}
      </Box>
    );
  };

  // Listening to the changes in userId
  useEffect(() => {
    if (!userId) {
      return;
    }

    const isAuthenticatedUser = userId === authenticatedUser.user.id;
    setIsShownUserAuthenticated(isAuthenticatedUser);

    setLoading(true);
    Promise.all([
      // Check the following relationship if the current user is not the authenticated one
      new Promise((resolve, reject) => {
        if (isAuthenticatedUser) {
          resolve();
        } else {
          getFollowingRelationship(authenticatedUser.user.id, userId)
            .then((data) => setIsFollowing(!!data))
            .catch((err) => reject(err));
        }
      }),
      // Get the user
      getUser(userId).then((data) => setUser(data)),
      // Fetch the trip plans of the user
      getTripPlansOfUser(userId).then((data) => setTripPlans(data)),
      // Get followers and followed of the user, and then get the num trips planned by each of them
      Promise.all([getFollowersOfUser(), getFollowedOfUser()]).then(
        ([followersOfUser, followedOfUser]) => {
          const users = [...followersOfUser, ...followedOfUser];
          const distinctUserIds = [...new Set(users.map(({ _id }) => _id))];

          return getNumTripsPlannedByUsers(distinctUserIds).then((data) => {
            setNumTripsPlannedByUsers(
              Object.assign(
                {},
                ...data.map(({ _id, numTripsPlanned }) => ({ [_id]: numTripsPlanned }))
              )
            );
          });
        }
      )
    ]).finally(() => setLoading(false));
  }, [userId]);

  const isFollowed = (id) => !!followedData[id];

  const updateFollowingRelationship = (id) => {
    if (isFollowed(id)) {
      // User was being followed, now "unfollow" them
      setLoading(true);
      deleteFollowingRelationship(authenticatedUser.user.id, id)
        .then(() => {
          delete followedData[id]; // Remove the user from the followed data object
        })
        .finally(() => setLoading(false));
    } else {
      // User was "not" being followed, now "follow" them
      setLoading(true);
      createFollowingRelationship(authenticatedUser.user.id, id)
        .then(() => {
          followedData[id] = followersData[id]; // Add the user to the followed data object
        })
        .finally(() => setLoading(false));
    }
  };

  if (loading) {
    return <Spinner marginTop="5em" />;
  }

  return (
    <Grid container spacing={2} m={5}>
      <Grid item xs={3}>
        <Grid container direction="column" justifyContent="center" alignItems="center">
          <Grid item xs={6}>
            <Avatar sx={avatarStyle} src={user.profilePicture} loading="lazy" />
          </Grid>

          <Grid item xs={3}>
            <Typography align="center" m={1} sx={{ fontWeight: 'bold', fontSize: 'subtitle1' }}>
              {user.firstName} {user.lastName}
            </Typography>
          </Grid>

          <Grid item xs={3} align-items="inherit">
            <Typography align="center">
              <IconButton sx={{ p: 0, display: 'inline' }}>
                <AlternateEmailIcon fontSize="small" sx={{ fontStyle: 'italic' }} />
              </IconButton>

              <Typography sx={{ display: 'inline' }}>{user.username || '...'}</Typography>
            </Typography>
          </Grid>
        </Grid>

        <Card sx={{ border: 'none', boxShadow: 'none', backgroundColor: appBackgroundColor }}>
          <CardContent>
            {isShownUserAuthenticated ? (
              <Grid>
                <Wallet />
              </Grid>
            ) : (
              <Grid justifyContent="center" display="flex">
                <Button variant="contained" color="primary">
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </Button>
              </Grid>
            )}
            <Grid pt={2}>
              <Card
                sx={{
                  width: '100%',
                  textAlign: 'center',
                  boxShadow: 4,
                  p: 1
                }}>
                <CardContent>
                  <Grid container justifyContent="center">
                    <Grid item sx={4} alignItems="center">
                      <Box
                        sx={{
                          pr: 2
                        }}>
                        <Box sx={{ color: 'text.secondary' }}> Followers </Box>
                        {isShownUserAuthenticated
                          ? getCountText(Object.keys(followersData).length, () =>
                              setFollowersModalShown(true)
                            )
                          : getCountTextForNonAuthenticatedUser(Object.keys(followersData).length)}
                      </Box>

                      <Modal
                        open={followersModalShown}
                        onClose={() => {
                          setFollowersModalShown(false);
                        }}>
                        <Card sx={modalStyle}>
                          <FollowingsCard
                            listName="Followers"
                            list={Object.values(followersData)}
                            numTripsPlannedByUsers={numTripsPlannedByUsers}
                            isFollowed={isFollowed}
                            onFollowingsButtonClick={updateFollowingRelationship}
                          />
                        </Card>
                      </Modal>
                    </Grid>

                    <Grid item sx={4}>
                      <Divider orientation="vertical" sx={{ fontWeight: 'bold' }} />
                    </Grid>

                    <Grid item sx={4} alignItems="center">
                      <Box
                        sx={{
                          pl: 2
                        }}>
                        <Box sx={{ color: 'text.secondary' }}> Following </Box>
                        {isShownUserAuthenticated
                          ? getCountText(Object.keys(followedData).length, () =>
                              setFollowedModalShown(true)
                            )
                          : getCountTextForNonAuthenticatedUser(Object.keys(followedData).length)}
                      </Box>

                      <Modal
                        open={followedModalShown}
                        onClose={() => {
                          setFollowedModalShown(false);
                        }}>
                        <Card sx={modalStyle}>
                          <FollowingsCard
                            listName="Following"
                            list={Object.values(followedData)}
                            numTripsPlannedByUsers={numTripsPlannedByUsers}
                            isFollowed={() => true}
                            onFollowingsButtonClick={updateFollowingRelationship}
                          />
                        </Card>
                      </Modal>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={1} />

      <Grid item xs={6}>
        <Grid>
          <Typography align="left" variant="h6" color="text.secondary">
            Trips: {tripPlans.length || 0}
          </Typography>
          <Divider />
        </Grid>
        <Grid container direction="column" justifyContent="center" alignItems="center" spacing={4}>
          <Grid item xs={9} sx={{ width: '100%' }}>
            <Stack spacing={2} pt={4}>
              {tripPlans
                ? tripPlans.map((tripPlan) => {
                    return <TripCard key={tripPlan._id} tripPlan={tripPlan} />;
                  })
                : []}
            </Stack>
          </Grid>
        </Grid>
      </Grid>
      {isShownUserAuthenticated ? (
        <Grid item xs={2}>
          <Button size="small" variant="outlined" onClick={() => setIsEditMode(true)}>
            Edit Profile
          </Button>
          <Modal
            open={isEditMode}
            onClose={() => {
              setIsEditMode(false);
            }}>
            <Card sx={{ minWidth: '500px', ...modalStyle }}>
              <EditUserProfileCard user={user} />
            </Card>
          </Modal>
        </Grid>
      ) : (
        <Grid item xs={2} />
      )}
    </Grid>
  );
}

export default UserProfilePage;
