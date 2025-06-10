import React from 'react';
import { Typography as MuiTypography } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledTypography = styled(MuiTypography)(({ theme, color, weight }) => ({
  color: color === 'primary'
    ? theme.palette.primary.main
    : color === 'secondary'
    ? theme.palette.secondary.main
    : color === 'error'
    ? theme.palette.error.main
    : color === 'warning'
    ? theme.palette.warning.main
    : color === 'info'
    ? theme.palette.info.main
    : color === 'success'
    ? theme.palette.success.main
    : color === 'textPrimary'
    ? theme.palette.text.primary
    : color === 'textSecondary'
    ? theme.palette.text.secondary
    : color,
  fontWeight: weight === 'light'
    ? 300
    : weight === 'regular'
    ? 400
    : weight === 'medium'
    ? 500
    : weight === 'semibold'
    ? 600
    : weight === 'bold'
    ? 700
    : weight,
}));

const Typography = ({
  variant = 'body1',
  color,
  weight,
  children,
  ...props
}) => {
  return (
    <StyledTypography
      variant={variant}
      color={color}
      weight={weight}
      {...props}
    >
      {children}
    </StyledTypography>
  );
};

export default Typography; 