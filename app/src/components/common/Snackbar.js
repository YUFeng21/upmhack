import React from 'react';
import { Snackbar as MuiSnackbar, Alert, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledSnackbar = styled(MuiSnackbar)(({ theme }) => ({
  '& .MuiAlert-root': {
    borderRadius: theme.shape.borderRadius,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    '& .MuiAlert-icon': {
      fontSize: 20,
    },
    '& .MuiAlert-message': {
      fontSize: '0.875rem',
    },
  },
}));

const Snackbar = ({
  open,
  onClose,
  message,
  severity = 'info',
  autoHideDuration = 6000,
  action,
  ...props
}) => {
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    onClose(event, reason);
  };

  return (
    <StyledSnackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      {...props}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        action={
          action || (
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          )
        }
      >
        {message}
      </Alert>
    </StyledSnackbar>
  );
};

export default Snackbar; 