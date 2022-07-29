import React from 'react';
import { Box, Modal, Alert } from '@mui/material';

const alertBoxStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 6,
  borderRadius: '15px'
};

export default function AlertModal({ open, onCloseFunction, message, type }) {
  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      style={{
        display: 'flex',
        justifyConent: 'center',
        alignItems: 'center'
      }}>
      <Box sx={alertBoxStyle}>
        <div className="center">
          <Alert
            severity={type}
            onClose={() => {
              onCloseFunction(false);
            }}>
            {message}
          </Alert>
        </div>
      </Box>
    </Modal>
  );
}
