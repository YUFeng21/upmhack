import React from 'react';
import { Avatar as MuiAvatar, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Person as PersonIcon } from '@mui/icons-material';

const StyledAvatar = styled(MuiAvatar)(({ theme, size }) => ({
  width: size === 'small' ? 32 : size === 'large' ? 64 : 40,
  height: size === 'small' ? 32 : size === 'large' ? 64 : 40,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  fontSize: size === 'small' ? '0.875rem' : size === 'large' ? '1.5rem' : '1rem',
  fontWeight: 600,
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  '&:hover': {
    boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
  },
}));

const Avatar = ({
  src,
  alt,
  size = 'medium',
  onClick,
  ...props
}) => {
  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Box
      sx={{
        display: 'inline-block',
        cursor: onClick ? 'pointer' : 'default',
      }}
      onClick={onClick}
    >
      <StyledAvatar
        src={src}
        alt={alt}
        size={size}
        {...props}
      >
        {!src && (alt ? getInitials(alt) : <PersonIcon />)}
      </StyledAvatar>
    </Box>
  );
};

export default Avatar; 