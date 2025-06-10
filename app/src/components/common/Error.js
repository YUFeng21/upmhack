import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Error as ErrorIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const ErrorContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '200px',
  width: '100%',
  padding: theme.spacing(3),
  textAlign: 'center',
}));

const ErrorIconWrapper = styled(Box)(({ theme }) => ({
  color: theme.palette.error.main,
  marginBottom: theme.spacing(2),
  '& svg': {
    fontSize: 48,
  },
}));

const Error = ({
  message = 'Something went wrong',
  retry,
  fullScreen = false,
  ...props
}) => {
  const content = (
    <>
      <ErrorIconWrapper>
        <ErrorIcon />
      </ErrorIconWrapper>
      <Typography variant="h6" color="error" gutterBottom>
        Error
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        {message}
      </Typography>
      {retry && (
        <Button
          variant="contained"
          color="primary"
          startIcon={<RefreshIcon />}
          onClick={retry}
          sx={{ mt: 2 }}
        >
          Try Again
        </Button>
      )}
    </>
  );

  if (fullScreen) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          zIndex: 9999,
        }}
      >
        {content}
      </Box>
    );
  }

  return <ErrorContainer {...props}>{content}</ErrorContainer>;
};

export default Error; 