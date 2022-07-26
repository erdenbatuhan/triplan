import { Grid, Card, Typography } from '@mui/material';
import PersonCard from './PersonCard';

const anilImg = require('../../assets/anilImg.png');
const batuhanImg = require('../../assets/batuhanImg.jpg');
const cansuImg = require('../../assets/cansuImg.png');
const eralpImg = require('../../assets/eralpImg.png');

const cardStyle = {
  boxSizing: 'border-box',
  height: '25vh'
};

export default function AboutUs() {
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
        About Us
      </Typography>
      <br />
      <Typography
        variant="body1"
        color="text.primary"
        style={{
          textAlign: 'left'
        }}>
        As young engineers who love to travel, we have developed the Triplan to solve the
        difficulties we encountered during out travel planning. Our aim is being the best assistant
        for travellers and being a global actor in the transformation of the travel market.
      </Typography>
      <br />
      <Grid container direction="column" spacing={2}>
        <Grid item xs={6}>
          <Grid container direction="row" spacing={2}>
            <Grid item xs={6}>
              <Card style={cardStyle}>
                <PersonCard
                  name="Anil Kul"
                  image={anilImg}
                  summary={['Data Scientist at SAP', 'M.Sc. Informatics Student at TUM']}
                  linkedInLink="https://www.linkedin.com/in/kulanil/"
                  githubLink="https://github.com/anilkul98"
                />
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card style={cardStyle}>
                <PersonCard
                  name="Batuhan Erden"
                  image={batuhanImg}
                  summary={['Software Engineer at Stryber', 'M.Sc. Informatics Student at TUM']}
                  linkedInLink="https://linkedin.com/in/batuhan-erden"
                  githubLink="https://github.com/erdenbatuhan"
                />
              </Card>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Grid container direction="row" spacing={2}>
            <Grid item xs={6}>
              <Card style={cardStyle}>
                <PersonCard
                  name="Cansu Yildirim"
                  image={cansuImg}
                  summary={['Software Engineer at Check24', 'M.Sc. Informatics Student at TUM']}
                  linkedInLink="https://www.linkedin.com/in/cansuyyildirim/"
                  githubLink="https://github.com/cansuyildirim"
                />
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card style={cardStyle}>
                <PersonCard
                  name="Halil Eralp Kocas"
                  image={eralpImg}
                  summary={['M.Sc. Informatics Student at TUM']}
                  linkedInLink="https://www.linkedin.com/in/halileralpkocas/"
                  githubLink="https://github.com/EralpKocas"
                />
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
