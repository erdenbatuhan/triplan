import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import StarRatings from 'react-star-ratings';
import Spinner from './Spinner';
import { updateRatingAndCommentOfTripLocation } from '../queries/trip-location-queries';

export default function TripPlanRatingCard({
  index,
  ranking,
  tripLocation,
  partnerLocation,
  onChangesSaved,
  latestUpdate
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
    <Card sx={{ width: 350, marginBottom: '2em' }}>
      <CardMedia
        component="img"
        alt="green iguana"
        height="150"
        image={partnerLocation.locationPicture}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {ranking} - {partnerLocation.name}
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
              <Typography sx={{ lineBreak: 'anywhere' }} variant="body2" color="text.secondary">
                {comment}
              </Typography>
            )}
          </div>
        )}
      </CardContent>

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
    </Card>
  );
}
