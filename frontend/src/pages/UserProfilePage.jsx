import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Button
} from '@mui/material';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import EditIcon from '@mui/icons-material/Edit';
import Spinner from '../components/common/Spinner';
import ContentModal from '../components/common/ContentModal';
import TripCard from '../components/UserProfilePage/TripCard';
import Wallet from '../components/UserProfilePage/Wallet';
import FollowingsCard from '../components/UserProfilePage/FollowingsCard';
import EditUserProfileCard from '../components/UserProfilePage/EditUserProfileCard';
import { UserAuthHelper } from '../authentication/user-auth-helper';
import { checkUser, getUser, updateUserFields } from '../queries/user-queries';
import {
  getFollowingRelationship,
  createFollowingRelationship,
  deleteFollowingRelationship,
  getFollowers,
  getFollowed
} from '../queries/following-relationship-queries';
import { getNumTripsPlannedByUsers, getTripPlansOfUser } from '../queries/trip-plan-queries';
import { BG_COLOR } from '../shared/constants';

const avatarStyle = {
  width: '200px',
  height: '200px'
};

function UserProfilePage() {
  const { userId } = useParams();

  const [authenticatedUser] = useState(UserAuthHelper.getStoredUser());
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  const [tripPlans, setTripPlans] = useState([]);
  const [followersData, setFollowersData] = useState({});
  const [followedData, setFollowedData] = useState({});
  const [authenticatedUserFollowedData, setAuthenticatedUserFollowedData] = useState({});
  // const [authenticatedUserFollowersData, setAuthenticatedUserFollowersData] = useState({});
  const [numTripsPlannedByUsers, setNumTripsPlannedByUsers] = useState([]);
  const [followersModalShown, setFollowersModalShown] = useState(false);
  const [followedModalShown, setFollowedModalShown] = useState(false);
  const [isProfileEditMode, setIsProfileEditMode] = useState(false);
  const [isEditInProgress, setIsEditInProgress] = useState(false);

  const [isShownUserAuthenticated, setIsShownUserAuthenticated] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const navigate = useNavigate();
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

  const isGivenUserAuthenticatedUser = (givenUserId) => givenUserId === authenticatedUser.user.id;

  const getFollowingRelationships = () => {
    return Promise.all([
      // Check the following relationship if the current user is not the authenticated one
      new Promise((resolve, reject) => {
        if (isGivenUserAuthenticatedUser(userId)) {
          setIsFollowing(false);
          resolve();
        } else {
          getFollowingRelationship(authenticatedUser.user.id, userId)
            .then(({ followingRelationship }) => {
              setIsFollowing(!!followingRelationship);
              resolve();
            })
            .catch((err) => reject(err));
        }
      }),
      Promise.all([
        getFollowed(authenticatedUser.user.id),
        /* getFollowers(authenticatedUser.user.id), */
        getFollowed(userId),
        getFollowers(userId)
      ]).then(
        ([
          followedOfAuthenticatedUser,
          /* followersOfAuthenticatedUser, */
          followedOfUser,
          followersOfUser
        ]) => {
          // Authenticated User's Following Data
          setAuthenticatedUserFollowedData(
            Object.assign({}, ...followedOfAuthenticatedUser.map((item) => ({ [item._id]: item })))
          );
          /* setAuthenticatedUserFollowersData(
            Object.assign({}, ...followersOfAuthenticatedUser.map((item) => ({ [item._id]: item })))
          ); */
          // Shown User's Following Data
          setFollowedData(
            Object.assign({}, ...followedOfUser.map((item) => ({ [item._id]: item })))
          );
          setFollowersData(
            Object.assign({}, ...followersOfUser.map((item) => ({ [item._id]: item })))
          );

          const users = [...followedOfUser, ...followersOfUser];
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
    ]);
  };

  // Listening to the changes in userId
  useEffect(() => {
    checkUser(userId)
      .then((data) => console.log('user data: ', data))
      .catch(({ response }) => navigate('/', { state: { response } }));
    // Reset the remaining state that is not reset below!
    setFollowersModalShown(false);
    setFollowedModalShown(false);
    setIsProfileEditMode(false);
    setIsEditInProgress(false);

    if (!userId) {
      return;
    }

    setIsShownUserAuthenticated(isGivenUserAuthenticatedUser(userId));

    setLoading(true);
    Promise.all([
      // Get the user
      getUser(userId).then((data) => setUser(data)),
      // Fetch the trip plans of the user
      getTripPlansOfUser(userId).then((data) => setTripPlans(data)),
      // Get followers and followed of the user, and then get the num trips planned by each of them
      getFollowingRelationships()
    ]).finally(() => setLoading(false));
  }, [userId]);

  const unfollow = (userIdUnfollowed) => {
    setLoading(true);
    deleteFollowingRelationship(authenticatedUser.user.id, userIdUnfollowed)
      .then(() => getFollowingRelationships()) // Re-fetch all the following relationships
      .finally(() => setLoading(false));
  };

  const follow = (userIdFollowed) => {
    setLoading(true);
    createFollowingRelationship(authenticatedUser.user.id, userIdFollowed)
      .then(() => getFollowingRelationships()) // Re-fetch all the following relationships
      .finally(() => setLoading(false));
  };

  const isFollowed = (id) => !!authenticatedUserFollowedData[id];

  const updateFollowingRelationship = (otherUserId) => {
    if (isFollowed(otherUserId)) {
      // User was being followed, now "unfollow" them
      unfollow(otherUserId);
    } else {
      // User was "not" being followed, now "follow" them
      follow(otherUserId);
    }
  };

  // Authenticated User Fields Edit
  const saveProfile = (params) => {
    setIsEditInProgress(true);
    updateUserFields(authenticatedUser.user.id, params)
      .then(() => getUser(userId).then((data) => setUser(data)))
      .finally(() => {
        setIsEditInProgress(false);
        setIsProfileEditMode(false);
      });
  };

  if (loading) {
    return <Spinner marginTop="5em" />;
  }

  return (
    <Grid container spacing={2} m={5} style={{ backgroundColor: BG_COLOR }}>
      <Grid item xs={3}>
        <Grid container direction="column" justifyContent="center" alignItems="center">
          <Grid item xs={6}>
            <Avatar sx={avatarStyle} src={user.profilePicture} loading="lazy" />
          </Grid>

          <Grid item xs={3} display="flex">
            <Typography
              component="div"
              align="center"
              m={1}
              sx={{ fontWeight: 'bold', fontSize: 'subtitle1' }}>
              {user.firstName} {user.lastName}
            </Typography>

            {isShownUserAuthenticated ? (
              <IconButton onClick={() => setIsProfileEditMode(true)}>
                <EditIcon fontSize="small" />
              </IconButton>
            ) : (
              []
            )}
            <ContentModal
              open={isProfileEditMode}
              onClose={() => {
                setIsProfileEditMode(false);
              }}
              contentStyle={{ minWidth: '500px' }}
              header="Edit Profile"
              contentRendered={
                <EditUserProfileCard
                  user={user}
                  isLoading={isEditInProgress}
                  handleUserFieldsChange={saveProfile}
                />
              }
            />
          </Grid>

          <Grid item xs={3} align-items="inherit">
            <Typography component="div" align="center">
              <IconButton sx={{ p: 0, display: 'inline' }}>
                <AlternateEmailIcon fontSize="small" sx={{ fontStyle: 'italic' }} />
              </IconButton>

              <Typography component="div" sx={{ display: 'inline' }}>
                {user.username || '...'}
              </Typography>
            </Typography>
          </Grid>
        </Grid>

        <Card sx={{ border: 'none', boxShadow: 'none', background: 'transparent' }}>
          <CardContent>
            {isShownUserAuthenticated ? (
              <Grid>
                <Wallet isUser />
              </Grid>
            ) : (
              <Grid justifyContent="center" display="flex">
                <Button
                  onClick={() => updateFollowingRelationship(userId)}
                  variant="contained"
                  color="primary">
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
                    <Grid item xs={4} alignItems="center">
                      <Box sx={{ pl: 4 }}>
                        <Box sx={{ color: 'text.secondary' }}> Followers </Box>
                        {getCountText(Object.keys(followersData).length, () =>
                          setFollowersModalShown(true)
                        )}
                      </Box>

                      <ContentModal
                        open={followersModalShown}
                        onClose={() => {
                          setFollowersModalShown(false);
                        }}
                        contentRendered={
                          <FollowingsCard
                            listName="Followers"
                            list={Object.values(followersData)}
                            numTripsPlannedByUsers={numTripsPlannedByUsers}
                            isFollowed={isFollowed}
                            isGivenUserAuthenticatedUser={isGivenUserAuthenticatedUser}
                            onFollowingsButtonClick={updateFollowingRelationship}
                          />
                        }
                      />
                    </Grid>

                    <Grid item xs={4}>
                      <Divider
                        orientation="vertical"
                        sx={{
                          fontWeight: 'bold',
                          display: 'inline-block',
                          justifyContent: 'center'
                        }}
                      />
                    </Grid>

                    <Grid item xs={4} alignItems="center">
                      <Box sx={{ pr: 4 }}>
                        <Box sx={{ color: 'text.secondary' }}> Following </Box>
                        {getCountText(Object.keys(followedData).length, () =>
                          setFollowedModalShown(true)
                        )}
                      </Box>

                      <ContentModal
                        open={followedModalShown}
                        onClose={() => {
                          setFollowedModalShown(false);
                        }}
                        contentRendered={
                          <FollowingsCard
                            listName="Following"
                            list={Object.values(followedData)}
                            numTripsPlannedByUsers={numTripsPlannedByUsers}
                            isFollowed={isFollowed}
                            isGivenUserAuthenticatedUser={isGivenUserAuthenticatedUser}
                            onFollowingsButtonClick={updateFollowingRelationship}
                          />
                        }
                      />
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
          <Typography component="div" align="left" variant="h6" color="text.secondary">
            Trips: {tripPlans.length || 0}
          </Typography>
          <Divider />
        </Grid>
        <Grid container direction="column" justifyContent="center" alignItems="center" spacing={4}>
          <Grid item xs={9} sx={{ width: '100%' }}>
            <Stack spacing={2} pt={4}>
              {tripPlans
                ? tripPlans.map((tripPlan) => {
                    return (
                      <TripCard
                        key={tripPlan._id}
                        tripPlan={tripPlan}
                        viewMode={!isShownUserAuthenticated}
                      />
                    );
                  })
                : []}
            </Stack>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default UserProfilePage;
