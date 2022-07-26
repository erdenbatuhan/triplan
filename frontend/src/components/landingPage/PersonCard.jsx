import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import Link from '@mui/material/Link';

export default function PersonCard({ name, image, summary, linkedInLink, githubLink }) {
  return (
    <Card
      sx={{
        maxWidth: '%100',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
      <Grid
        container
        direction="row"
        ml={2}
        mt={2}
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
          <CardContent>
            <Typography gutterBottom variant="h4" color="text.primary">
              {name}
            </Typography>
            {summary.map((sum) => (
              <Typography key={sum} variant="body2" color="text.primary">
                <li>{sum} </li>
              </Typography>
            ))}
            <CardContent>
              <Link href={linkedInLink}>
                <LinkedInIcon fontSize="large" />
              </Link>
              <Link href={githubLink}>
                <GitHubIcon fontSize="large" />
              </Link>
            </CardContent>
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  );
}
