import React from 'react';
import {
  Dialog as MuiDialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import Button from './Button';

const StyledDialog = styled(MuiDialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(1),
  },
  '& .MuiDialogTitle-root': {
    padding: theme.spacing(2),
    '& .MuiTypography-root': {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
  },
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(2),
    gap: theme.spacing(1),
  },
}));

const DialogTitleWithClose = ({ children, onClose, ...props }) => (
  <DialogTitle {...props}>
    <Box display="flex" alignItems="center" justifyContent="space-between">
      <Typography variant="h6" component="div">
        {children}
      </Typography>
      {onClose && (
        <IconButton
          aria-label="close"
          onClick={onClose}
          size="small"
          sx={{
            color: (theme) => theme.palette.grey[500],
            '&:hover': {
              color: (theme) => theme.palette.grey[700],
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      )}
    </Box>
  </DialogTitle>
);

const Dialog = ({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = 'sm',
  fullWidth = true,
  ...props
}) => {
  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      {...props}
    >
      <DialogTitleWithClose onClose={onClose}>{title}</DialogTitleWithClose>
      <DialogContent>{children}</DialogContent>
      {actions && actions.length > 0 && (
        <DialogActions>
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || 'contained'}
              color={action.color || 'primary'}
              onClick={action.onClick}
              disabled={action.disabled}
              loading={action.loading}
              startIcon={action.icon}
            >
              {action.text}
            </Button>
          ))}
        </DialogActions>
      )}
    </StyledDialog>
  );
};

export default Dialog; 