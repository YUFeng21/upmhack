import React from 'react';
import { Badge as MuiBadge, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledBadge = styled(MuiBadge)(({ theme, color = 'primary' }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: theme.palette[color].main,
    color: theme.palette[color].contrastText,
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

const Badge = ({
  children,
  badgeContent,
  color = 'primary',
  variant = 'standard',
  showZero = false,
  max = 99,
  overlap = 'rectangular',
  anchorOrigin = {
    vertical: 'top',
    horizontal: 'right',
  },
  ...props
}) => {
  return (
    <Box sx={{ display: 'inline-block' }}>
      <StyledBadge
        badgeContent={badgeContent}
        color={color}
        variant={variant}
        showZero={showZero}
        max={max}
        overlap={overlap}
        anchorOrigin={anchorOrigin}
        {...props}
      >
        {children}
      </StyledBadge>
    </Box>
  );
};

export default Badge; 