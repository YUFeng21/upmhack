import React from 'react';
import { Container as MuiContainer } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledContainer = styled(MuiContainer)(({ theme, maxWidth = 'lg', disableGutters = false }) => ({
  paddingLeft: disableGutters ? 0 : theme.spacing(2),
  paddingRight: disableGutters ? 0 : theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    paddingLeft: disableGutters ? 0 : theme.spacing(3),
    paddingRight: disableGutters ? 0 : theme.spacing(3),
  },
  [theme.breakpoints.up('md')]: {
    paddingLeft: disableGutters ? 0 : theme.spacing(4),
    paddingRight: disableGutters ? 0 : theme.spacing(4),
  },
  [theme.breakpoints.up('lg')]: {
    paddingLeft: disableGutters ? 0 : theme.spacing(5),
    paddingRight: disableGutters ? 0 : theme.spacing(5),
  },
}));

const Container = ({
  children,
  maxWidth = 'lg',
  disableGutters = false,
  ...props
}) => {
  return (
    <StyledContainer
      maxWidth={maxWidth}
      disableGutters={disableGutters}
      {...props}
    >
      {children}
    </StyledContainer>
  );
};

export default Container; 