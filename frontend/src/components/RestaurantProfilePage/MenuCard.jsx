import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import ListItem from '@mui/material/ListItem';
import PropTypes from 'prop-types';

export default function PlaceCard(props) {
  const { name, content, price, imgUrl } = props;
  return (
    <Card sx={{ maxWidth: '%100' }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <img
              src={`${imgUrl}?w=164&h=164&fit=crop&auto=format`}
              srcSet={`${imgUrl}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
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
                {price}
              </Typography>
            </CardContent>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

PlaceCard.propTypes = {
  name: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  imgUrl: PropTypes.string.isRequired
};
