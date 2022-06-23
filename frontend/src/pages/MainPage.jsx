import React from 'react';
import { Button, Box, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import DatePicker from '../components/DatePicker';
import SearchBar from '../components/SearchBar';

const CustomGrid = styled(Grid)(() => ({
  justifyContent: 'center',
  alignItems: 'center'
}));

function MainPage() {
  return (
    <CustomGrid container height="100vh" display="inline-grid">
      <CustomGrid container spacing={2} direction="row">
        <Grid item md={8}>
          <SearchBar />
        </Grid>
        <Grid item md={4}>
          <DatePicker />
        </Grid>
        <Box>
          <Button variant="outlined" href="/trip-planning">
            Continue
          </Button>
        </Box>
      </CustomGrid>
    </CustomGrid>
  );
}

export default MainPage;
