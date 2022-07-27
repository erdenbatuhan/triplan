import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  TextField,
  Avatar
} from '@mui/material';
import StarRatings from 'react-star-ratings';
import Spinner from './Spinner';
import { updateRatingAndCommentOfTripLocation } from '../queries/trip-location-queries';

export default function TripPlanRatingCard({
  index,
  ranking,
  tripLocation,
  partnerLocation,
  onChangesSaved,
  latestUpdate,
  viewMode
}) {
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [changesMade, setChangesMade] = useState(false);
  const [rating, setRating] = useState(tripLocation ? tripLocation.rating : 0);
  const [comment, setComment] = useState(tripLocation ? tripLocation.comment : '');

  // Listening to the changes in latestUpdate
  useEffect(() => {
    setChangesMade(false);
    setRating(tripLocation.rating);
    setComment(tripLocation.comment);
  }, [latestUpdate]);

  // Listening to the changes in rating and comment
  useEffect(() => {
    setChangesMade(tripLocation.rating !== rating || tripLocation.comment !== comment);
  }, [rating, comment]);

  const saveChanges = () => {
    setLoading(true);

    updateRatingAndCommentOfTripLocation(tripLocation._id, rating, comment)
      .then((savedTripLocation) => {
        onChangesSaved({ index, savedTripLocation });
      })
      .finally(() => {
        setEditMode(false);
        setLoading(false);
      });
  };

  const removeChanges = () => {
    setRating(tripLocation ? tripLocation.rating : 0);
    setComment(tripLocation ? tripLocation.comment : '');
  };

  return (
    <Card sx={{ width: '100%', marginBottom: 1 }}>
      <Grid container direction="column" marginTop={4}>
        <Grid item xs={8}>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            display="inline-flex">
            <Grid item xs={4} justifyItems="center" display="inline-grid">
              <Avatar
                sx={{
                  width: editMode ? '150px' : '125px',
                  height: editMode ? '150px' : '125px'
                }}
                src={partnerLocation.locationPicture}
              />

              {editMode ? (
                <div>
                  <br />
                  <Typography
                    display="contents"
                    textAlign="center"
                    variant="caption"
                    color="text.secondary">
                    {partnerLocation.description}
                  </Typography>
                </div>
              ) : (
                <div />
              )}
            </Grid>
            <Grid item xs={8} padding="unset">
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  {ranking}. {partnerLocation.name}
                </Typography>

                {loading ? (
                  <Spinner marginTop="1.5em" />
                ) : (
                  <div>
                    <StarRatings
                      name="rating"
                      starRatedColor={editMode ? `red` : `gray`}
                      starDimension="1.75em"
                      starSpacing="0.1em"
                      numberOfStars={5}
                      rating={rating}
                      changeRating={editMode ? setRating : null}
                    />

                    {comment || editMode ? (
                      <div>
                        <br />
                      </div>
                    ) : (
                      <div />
                    )}

                    {editMode ? (
                      <TextField
                        label="Comment"
                        rows={4}
                        fullWidth
                        multiline
                        disabled={!editMode}
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                      />
                    ) : (
                      <Typography
                        sx={{ lineBreak: 'anywhere' }}
                        variant="body2"
                        color="text.secondary">
                        {comment}
                      </Typography>
                    )}
                  </div>
                )}
              </CardContent>
            </Grid>
            {!viewMode ? (
              <Grid item xs={4}>
                {!loading ? (
                  <CardActions>
                    <Button size="small" onClick={() => setEditMode(!editMode)}>
                      {editMode ? `Stop Editing` : `Edit Rating & Comment`}
                    </Button>

                    {changesMade ? (
                      <Button size="small" onClick={editMode ? saveChanges : removeChanges}>
                        {editMode ? `Save Changes` : `Remove Changes`}
                      </Button>
                    ) : (
                      <div />
                    )}
                  </CardActions>
                ) : (
                  <div>
                    <br />
                  </div>
                )}
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
