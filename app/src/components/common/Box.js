import React from 'react';
import { Box as MuiBox } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledBox = styled(MuiBox)(({ theme, elevation = 0, square = false }) => ({
  borderRadius: square ? 0 : theme.shape.borderRadius,
  boxShadow: elevation === 0
    ? 'none'
    : elevation === 1
    ? '0 2px 8px rgba(0,0,0,0.1)'
    : elevation === 2
    ? '0 4px 12px rgba(0,0,0,0.15)'
    : elevation === 3
    ? '0 8px 16px rgba(0,0,0,0.2)'
    : theme.shadows[elevation],
  transition: theme.transitions.create(['box-shadow', 'transform']),
  '&:hover': {
    boxShadow: elevation === 0
      ? 'none'
      : elevation === 1
      ? '0 4px 12px rgba(0,0,0,0.15)'
      : elevation === 2
      ? '0 8px 16px rgba(0,0,0,0.2)'
      : elevation === 3
      ? '0 12px 24px rgba(0,0,0,0.25)'
      : theme.shadows[elevation + 1],
    transform: elevation > 0 ? 'translateY(-2px)' : 'none',
  },
}));

const Box = ({
  children,
  elevation = 0,
  square = false,
  ...props
}) => {
  return (
    <StyledBox
      elevation={elevation}
      square={square}
      {...props}
    >
      {children}
    </StyledBox>
  );
};

export default Box; 