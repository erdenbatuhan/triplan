import { useState, useRef } from 'react';
import { Typography, Grid, Box, TextField, Button, Modal } from '@mui/material';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { handleEmail } from '../../queries/email-queries';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 2,
  borderRadius: '15px'
};

export default function ContactUs() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const nameInput = useRef(null);
  const emailInput = useRef(null);
  const messageInput = useRef(null);

  const onNameChange = (e) => {
    setName(e.target.value);
  };

  const onEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const onMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmitMessage = () => {
    console.log(email, name);
    handleEmail(
      {
        to_email: 'seba.tum2022@gmail.com',
        intro_message: 'You have an incoming message from a user.',
        details_message: 'The message details:',
        details_1: `Sender Email: ${email}`,
        details_2: `Sender Name: ${name}`,
        details_3: `The Message:`,
        details_4: message
      },
      'general'
    ).then(() => setIsOpen(true));
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
        Contact Us
      </Typography>
      <div
        style={{
          position: 'absolute',
          left: '10%',
          top: '10%',
          boxSizing: 'border-box',
          width: '80%'
        }}>
        <br />
        <br />
        <br />

        <Grid container>
          <Grid item xs={1} />

          <Grid item xs={10}>
            <Grid container>
              <Grid item xs={6}>
                <Box
                  component="form"
                  style={{
                    padding: 10
                  }}>
                  <TextField
                    fullWidth
                    label="Your Name"
                    inputRef={nameInput}
                    onChange={onNameChange}
                  />
                </Box>
              </Grid>

              <Grid item xs={6}>
                <Box
                  component="form"
                  style={{
                    padding: 10
                  }}>
                  <TextField
                    fullWidth
                    label="Your Email"
                    inputRef={emailInput}
                    onChange={onEmailChange}
                  />
                </Box>
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={12}>
                <Box
                  style={{
                    maxWidth: '100%',
                    padding: 10
                  }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={6}
                    label="Your Message"
                    inputRef={messageInput}
                    onChange={onMessageChange}
                  />
                </Box>
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={12}>
                <Box
                  style={{
                    maxWidth: '100%',
                    textAlign: 'center',
                    padding: 20
                  }}>
                  <Button
                    sx={{ width: '60%' }}
                    variant="contained"
                    color="success"
                    onClick={handleSubmitMessage}
                    disabled={!name || !email || !message}>
                    Submit Message
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={1} />
        </Grid>
      </div>
      <Modal
        open={isOpen}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{
          display: 'flex',
          justifyConent: 'center',
          alignItems: 'center'
        }}>
        <Box sx={style}>
          <div className="center">
            <Alert severity="success">
              <AlertTitle>Success</AlertTitle>
              Thank you for reach us. Your message is successfully sent. We will get back to you as
              soon as possible!
            </Alert>

            <Button
              alignItems="center"
              onClick={() => {
                setIsOpen(false);
                nameInput.current.value = '';
                emailInput.current.value = '';
                messageInput.current.value = '';
              }}>
              Continue
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
