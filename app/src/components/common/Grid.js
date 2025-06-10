import React from 'react';
import { Grid as MuiGrid } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledGrid = styled(MuiGrid)(({ theme, spacing = 2 }) => ({
  margin: -theme.spacing(spacing / 2),
  width: `calc(100% + ${theme.spacing(spacing)}px)`,
  '& > .MuiGrid-item': {
    padding: theme.spacing(spacing / 2),
  },
}));

const Grid = ({
  container = false,
  item = false,
  spacing = 2,
  children,
  ...props
}) => {
  return (
    <StyledGrid
      container={container}
      item={item}
      spacing={spacing}
      {...props}
    >
      {children}
    </StyledGrid>
  );
};

export default Grid; 