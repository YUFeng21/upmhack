import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Inbox as InboxIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const EmptyStateContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '200px',
  width: '100%',
  padding: theme.spacing(3),
  textAlign: 'center',
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  color: theme.palette.grey[400],
  marginBottom: theme.spacing(2),
  '& svg': {
    fontSize: 64,
  },
}));

const EmptyState = ({
  title = 'No Data',
  message = 'There is no data to display at the moment.',
  action,
  icon = <InboxIcon />,
  ...props
}) => {
  return (
    <EmptyStateContainer {...props}>
      <IconWrapper>{icon}</IconWrapper>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        {message}
      </Typography>
      {action && (
        <Button
          variant="contained"
          color="primary"
          startIcon={action.icon}
          onClick={action.onClick}
          sx={{ mt: 2 }}
        >
          {action.text}
        </Button>
      )}
    </EmptyStateContainer>
  );
};

export default EmptyState; 