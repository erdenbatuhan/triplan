import { Grid, Card, Typography } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useState } from 'react';
import { SECONDARY_COLOR } from '../../shared/constants';
import WhyTriplanCard from './WhyTriplanCard';

const personalizedImg = require('../../assets/personalized.png');
const timeSaverImg = require('../../assets/timeSaver.png');
const easeOfUseImg = require('../../assets/userFriendly.png');
const globalReachImg = require('../../assets/globalReach.png');
const increaseIncome = require('../../assets/increaseIncome.png');

const cardStyle = {
  boxSizing: 'border-box',
  height: '60vh',
  color: SECONDARY_COLOR
};

export default function WhyTriplan() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: '10%',
        top: '10%',
        boxSizing: 'border-box',
        width: '80%',
        height: '80%'
      }}>
      <Typography
        variant="h2"
        color="text.primary"
        style={{
          textAlign: 'center'
        }}>
        Why Triplan?
      </Typography>
      <br />
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="inherit"
        centered
        aria-label="full width tabs example">
        <Tab label="Travellers">1</Tab>
        <Tab label="Partners">2 </Tab>
      </Tabs>
      <br />
      {value === 0 ? (
        <Grid container direction="row" spacing={2}>
          <Grid item xs={4}>
            <Card style={cardStyle}>
              <WhyTriplanCard
                title="Personalized"
                image={personalizedImg}
                summary={[
                  'Travel plans according to your preferences',
                  'Choose places according to following advices',
                  'Get places according to your budget'
                ]}
              />
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card style={cardStyle}>
              <WhyTriplanCard
                title="Time Saver"
                image={timeSaverImg}
                summary={[
                  'Choose places in a couple of minutes',
                  'Get optimized route instantly',
                  'Choose paid services and pay in a few minutes.'
                ]}
              />
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card style={cardStyle}>
              <WhyTriplanCard
                title="Ease of Use"
                image={easeOfUseImg}
                summary={[
                  'See the trip points on maps',
                  'Choose places and services from smart lists',
                  'Get trip summary and information via email'
                ]}
              />
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Grid container direction="row" spacing={2}>
          <Grid item xs={6}>
            <Card style={cardStyle}>
              <WhyTriplanCard
                title="Global Reach"
                image={globalReachImg}
                summary={[
                  'Increase your visibility in travel market',
                  'Reach customers from all over the World'
                ]}
              />
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card style={cardStyle}>
              <WhyTriplanCard
                title="Increase Income"
                image={increaseIncome}
                summary={[
                  'Increase your sales with presaled services',
                  'Better sale prediction for future coming from the tourists'
                ]}
              />
            </Card>
          </Grid>
        </Grid>
      )}
    </div>
  );
}
