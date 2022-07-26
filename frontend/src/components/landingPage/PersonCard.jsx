import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import ListItem from '@mui/material/ListItem';

export default function PersonCard({ name, image, summary }) {
  return (
    <Card
      sx={{
        maxWidth: '%100',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
      <Grid
        container
        direction="row"
        spacing={2}
        ml={2}
        style={{
          height: '%100'
        }}>
        <Grid item xs={4}>
          <CardMedia
            component="img"
            sx={{ borderRadius: 8, height: '20vh', width: '20vh' }}
            image={image}
            alt={image}
          />
        </Grid>
        <Grid item xs={8}>
          <ListItem>
            <CardContent>
              <Typography gutterBottom variant="h4" color="text.primary">
                {name}
              </Typography>
              {summary.map((sum) => (
                <Typography key={sum} variant="body2" color="text.primary">
                  - {sum}
                </Typography>
              ))}
            </CardContent>
          </ListItem>
        </Grid>
      </Grid>
    </Card>
  );
}
