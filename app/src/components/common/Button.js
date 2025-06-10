import React from 'react';
import { Button as MuiButton, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledButton = styled(MuiButton)(({ theme, variant, fullWidth, size }) => ({
  borderRadius: theme.shape.borderRadius,
  textTransform: 'none',
  fontWeight: 600,
  padding: size === 'small' ? '8px 16px' : '12px 24px',
  minWidth: size === 'small' ? '100px' : '120px',
  width: fullWidth ? '100%' : 'auto',
  boxShadow: variant === 'contained' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
  '&:hover': {
    boxShadow: variant === 'contained' ? '0 4px 8px rgba(0,0,0,0.15)' : 'none',
  },
  '&.Mui-disabled': {
    backgroundColor: variant === 'contained' ? theme.palette.grey[300] : 'transparent',
    color: theme.palette.grey[500],
  },
}));

const Button = ({
  children,
  loading = false,
  startIcon,
  endIcon,
  disabled,
  size = 'medium',
  variant = 'contained',
  color = 'primary',
  fullWidth = false,
  onClick,
  type = 'button',
  ...props
}) => {
  return (
    <StyledButton
      variant={variant}
      color={color}
      disabled={disabled || loading}
      onClick={onClick}
      size={size}
      fullWidth={fullWidth}
      type={type}
      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : startIcon}
      endIcon={endIcon}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default Button; 