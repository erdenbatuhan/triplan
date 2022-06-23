import React from 'react';
import PropTypes from 'prop-types';
import { Container, Grid, Typography, TextField, Button } from '@mui/material';

const titleInputBoxComponent = (props) => {
  const { title, inputdefaultvalue } = props;
  return (
    <>
      {/* <Typography align="left">{title}</Typography> */}
      <TextField required id="outlined-required" label={title} defaultValue={inputdefaultvalue} />
    </>
  );
};

function LoginPage() {
  return (
    <Container>
      <Grid container direction="column" justifyContent="center" alignItems="center" spacing={2}>
        <Grid item xs={4}>
          <Typography align="center">Welcome to the Triplanner!</Typography>
        </Grid>
        <Grid item xs={4}>
          {titleInputBoxComponent({ title: 'Username', inputdefaultvalue: '' })}
        </Grid>
        <Grid item xs={4}>
          {titleInputBoxComponent({ title: 'Password', inputdefaultvalue: '' })}
        </Grid>
        <Grid item xs={4}>
          <Button href="/">Login</Button>
        </Grid>
      </Grid>
    </Container>
  );
}

titleInputBoxComponent.propTypes = {
  title: PropTypes.string.isRequired,
  inputDefaultValue: PropTypes.string.isRequired
};

// titleInputBoxComponent.defaultProps = {
// };

export default LoginPage;
