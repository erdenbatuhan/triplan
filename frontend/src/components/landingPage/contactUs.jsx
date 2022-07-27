import { useState, useRef } from 'react';
import { Typography, Box, TextField, Button, Modal } from '@mui/material';
import { green } from '@mui/material/colors';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { handleEmail } from '../../queries/email-queries';

// import { SECONDARY_COLOR } from '../../shared/constants';
// import WhyTriplanCard from './whyTriplanCard';

// const personalizedImg = require('../../assets/personalized.png');

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

  const onNameChanged = (e) => {
    setName(e.target.value);
  };

  const onEmailChanged = (e) => {
    setEmail(e.target.value);
  };

  const onMessageChanged = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmitMessage = () => {
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
        Contact With Us
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
        <Box
          component="form"
          style={{
            maxWidth: '100%',
            padding: 10
          }}>
          <TextField
            label="Your Email"
            id="fullWidth"
            inputRef={emailInput}
            onChange={onEmailChanged}
          />
        </Box>
        <Box
          component="form"
          style={{
            maxWidth: '100%',
            padding: 10
          }}>
          <TextField
            label="Your Name"
            id="fullWidth"
            inputRef={nameInput}
            onChange={onNameChanged}
          />
        </Box>
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
            onChange={onMessageChanged}
          />
        </Box>
        <Box
          style={{
            maxWidth: '100%',
            textAlign: 'center',
            padding: 20
          }}>
          <Button
            style={{
              color: '#FFFFFF',
              backgroundColor: green[500],
              width: '60%',
              border: 1,
              // borderColor: grey[500],
              borderRadius: 4,
              height: '50px'
            }}
            onClick={handleSubmitMessage}>
            Submit Message
          </Button>
        </Box>
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
