import React from 'react';
import { Box, Grid, Modal, Typography } from '@mui/material';

const modalBoxStyles = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  justifyConent: 'center',
  alignItems: 'center',
  borderRadius: 8
};

export default function ContentModal({
  open,
  onClose,
  contentStyle,
  header,
  subtitle,
  contentRendered
}) {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalBoxStyles}>
        <Grid sx={contentStyle} alignItems="stretch">
          {header ? (
            <Typography
              sx={{ color: 'text.secondary', fontWeight: 'medium', fontSize: 25, pb: 2 }}
              align="center">
              {header}
            </Typography>
          ) : (
            []
          )}

          {subtitle ? (
            <Typography sx={{ color: 'text.secondary', fontSize: 12 }} align="center">
              {subtitle}
            </Typography>
          ) : (
            []
          )}

          {contentRendered}
        </Grid>
      </Box>
    </Modal>
  );
}
