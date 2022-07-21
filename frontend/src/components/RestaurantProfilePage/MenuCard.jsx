/* eslint-disable react/jsx-no-useless-fragment */
import * as React from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import ListItem from '@mui/material/ListItem';
import PropTypes from 'prop-types';
import { Button, Stack } from '@mui/material';

export default function MenuCard(props) {
  const { menuIdx, name, content, price, image, handleEditClick, inEdit } = props;
  // const navigate = useNavigate();
  // const { partnerId } = useParams();

  return (
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
            <Button value={menuIdx} onClick={handleEditClick}>
              Edit
            </Button>
          ) : (
            <></>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

MenuCard.propTypes = {
  // menuId: PropTypes.string.isRequired,
  menuIdx: PropTypes.number,
  name: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  inEdit: PropTypes.bool
};

MenuCard.defaultProps = {
  menuIdx: -1,
  inEdit: false
};
