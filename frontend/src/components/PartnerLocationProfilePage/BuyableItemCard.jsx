/* eslint-disable react/jsx-no-useless-fragment */
import * as React from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
// import ListItem from '@mui/material/ListItem';
import PropTypes from 'prop-types';
import { Button, Stack, Avatar } from '@mui/material';

export default function BuyableItemCard(props) {
  const {
    itemIdx,
    name,
    content,
    price,
    image,
    handleEditClick,
    handleDeleteClick /* , inEdit */
  } = props;
  // const navigate = useNavigate();
  // const { partnerId } = useParams();

  return (
    <Card sx={{ width: '100%', marginBottom: 1 }}>
      <Grid container direction="column" marginTop={4}>
        <Grid item xs={8}>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            display="inline-flex"
            mb={2}>
            <Grid item xs={4} justifyItems="center" display="inline-grid">
              <Avatar
                sx={{
                  width: '125px',
                  height: '125px'
                }}
                src={image}
              />
            </Grid>
            <Grid item xs={8} padding="unset">
              <CardContent>
                <Grid container direction="column">
                  <Grid item xs={6}>
                    <Typography gutterBottom variant="h6" component="div">
                      {name}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      {content}
                    </Typography>
                  </Grid>

                  <Grid item xs={1} sx={{ mb: 2 }} />

                  <Grid item xs={2} justifyContent="right">
                    <Typography variant="h5" color="text.secondary">
                      {price} €
                    </Typography>
                  </Grid>

                  <Grid item xs={1} />

                  <Grid item xs={2} justifyContent="inherit">
                    <Stack direction="row" spacing={2}>
                      <Button value={itemIdx} onClick={handleEditClick}>
                        Edit
                      </Button>
                      <Button value={itemIdx} onClick={handleDeleteClick}>
                        Delete
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
  /* return (
    <Card sx={{ maxWidth: '%100' }}>
      <CardContent>
        <Stack direction="row" spacing={2}>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <img
                src={`${image}?w=164&h=164&fit=crop&auto=format`}
                srcSet={`${image}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                alt=""
                loading="lazy"
                width={150}
                height={150}
              />
            </Grid>
            <Grid item xs={6}>
              <ListItem>
                <CardContent>
                  <Typography gutterBottom variant="h3" component="div">
                    {name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {content}
                  </Typography>
                </CardContent>
              </ListItem>
            </Grid>
            <Grid item xs={3}>
              <CardContent>
                <Typography variant="h5" color="text.secondary">
                  {price} €
                </Typography>
              </CardContent>
            </Grid>
          </Grid>
          {inEdit ? (
            <Stack direction="row" spacing={2}>
              <Button value={itemIdx} onClick={handleEditClick}>
                Edit
              </Button>
              <Button value={itemIdx} onClick={handleDeleteClick}>
                Delete
              </Button>
            </Stack>
          ) : (
            <></>
          )}
        </Stack>
      </CardContent>
    </Card>
  ); */
}

BuyableItemCard.propTypes = {
  itemIdx: PropTypes.number,
  name: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired
  // inEdit: PropTypes.bool
};

BuyableItemCard.defaultProps = {
  itemIdx: -1
  // inEdit: false
};
