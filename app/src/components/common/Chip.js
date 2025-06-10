import React from 'react';
import { Chip as MuiChip } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledChip = styled(MuiChip)(({ theme, color = 'default' }) => ({
  borderRadius: theme.shape.borderRadius,
  fontWeight: 500,
  '&.MuiChip-root': {
    backgroundColor: color === 'default' ? theme.palette.grey[100] : theme.palette[color].light,
    color: color === 'default' ? theme.palette.text.primary : theme.palette[color].main,
    '& .MuiChip-deleteIcon': {
      color: color === 'default' ? theme.palette.grey[500] : theme.palette[color].main,
      '&:hover': {
        color: color === 'default' ? theme.palette.grey[700] : theme.palette[color].dark,
      },
    },
  },
  '&.MuiChip-outlined': {
    backgroundColor: 'transparent',
    borderColor: color === 'default' ? theme.palette.grey[300] : theme.palette[color].main,
    '& .MuiChip-deleteIcon': {
      color: color === 'default' ? theme.palette.grey[500] : theme.palette[color].main,
    },
  },
  '&.MuiChip-clickable': {
    '&:hover': {
      backgroundColor: color === 'default' ? theme.palette.grey[200] : theme.palette[color].lighter,
    },
    '&:focus': {
      backgroundColor: color === 'default' ? theme.palette.grey[300] : theme.palette[color].light,
    },
  },
  '& .MuiChip-icon': {
    color: color === 'default' ? theme.palette.grey[700] : theme.palette[color].main,
  },
  '& .MuiChip-label': {
    padding: '0 12px',
  },
}));

const Chip = ({
  label,
  color = 'default',
  variant = 'filled',
  size = 'medium',
  icon,
  onDelete,
  onClick,
  ...props
}) => {
  return (
    <StyledChip
      label={label}
      color={color}
      variant={variant}
      size={size}
      icon={icon}
      onDelete={onDelete}
      onClick={onClick}
      {...props}
    />
  );
};

export default Chip; 