import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
// import LinkedInIcon from '@mui/icons-material/LinkedIn';
// import GitHubIcon from '@mui/icons-material/GitHub';
// import Link from '@mui/material/Link';
// import { Box } from '@mui/material';
// import { SECONDARY_COLOR } from '../../shared/constants';

export default function WhyTriplanCard({ title, image, summary }) {
  return (
    <Card
      sx={{
        height: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
      }}>
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        spacing={2}
        mt={2}
        style={{
          height: '%100'
        }}>
        <Grid item xs={2}>
          <CardMedia
            component="img"
            sx={{ borderRadius: 8, height: '20vh', width: '20vh' }}
            image={image}
            alt={image}
          />
        </Grid>
        <Grid item xs={10}>
          <Grid container direction="row">
            <CardContent>
              <Typography
                gutterBottom
                variant="h4"
                color="#FFFFFF"
                textAlign="center"
                fontWeight="bold">
                {title}
              </Typography>
              {summary.map((sum) => (
                <Typography key={sum} variant="body2" color="#FFFFFF" fontWeight="medium">
                  <li>{sum} </li>
                </Typography>
              ))}
            </CardContent>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
}
