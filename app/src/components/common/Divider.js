import React from 'react';
import { Divider as MuiDivider } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledDivider = styled(MuiDivider)(({ theme, color, thickness, spacing }) => ({
  margin: spacing ? theme.spacing(spacing) : theme.spacing(2, 0),
  borderColor: color === 'primary'
    ? theme.palette.primary.main
    : color === 'secondary'
    ? theme.palette.secondary.main
    : color === 'error'
    ? theme.palette.error.main
    : color === 'warning'
    ? theme.palette.warning.main
    : color === 'info'
    ? theme.palette.info.main
    ? theme.palette.success.main
    : color === 'textPrimary'
    ? theme.palette.text.primary
    : color === 'textSecondary'
    ? theme.palette.text.secondary
    : color,
  borderWidth: thickness || 1,
  opacity: 0.1,
}));

const Divider = ({
  orientation = 'horizontal',
  color,
  thickness,
  spacing,
  flexItem = false,
  ...props
}) => {
  return (
    <StyledDivider
      orientation={orientation}
      color={color}
      thickness={thickness}
      spacing={spacing}
      flexItem={flexItem}
      {...props}
    />
  );
};

export default Divider; 