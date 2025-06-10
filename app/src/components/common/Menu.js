import React from 'react';
import {
  Menu as MuiMenu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledMenu = styled(MuiMenu)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: theme.shape.borderRadius,
    minWidth: 180,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    '& .MuiList-root': {
      padding: theme.spacing(1),
    },
  },
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1, 2),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  '&.Mui-selected': {
    backgroundColor: `${theme.palette.primary.main}15`,
    '&:hover': {
      backgroundColor: `${theme.palette.primary.main}25`,
    },
  },
  '& .MuiListItemIcon-root': {
    minWidth: 40,
    color: theme.palette.text.secondary,
  },
  '& .MuiListItemText-primary': {
    fontSize: '0.875rem',
    fontWeight: 500,
  },
}));

const Menu = ({
  anchorEl,
  open,
  onClose,
  children,
  ...props
}) => {
  return (
    <StyledMenu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      {...props}
    >
      {children}
    </StyledMenu>
  );
};

const MenuItemWithIcon = ({
  icon,
  label,
  selected = false,
  onClick,
  ...props
}) => {
  return (
    <StyledMenuItem
      selected={selected}
      onClick={onClick}
      {...props}
    >
      {icon && <ListItemIcon>{icon}</ListItemIcon>}
      <ListItemText>{label}</ListItemText>
    </StyledMenuItem>
  );
};

Menu.Item = MenuItemWithIcon;
Menu.Divider = Divider;

export default Menu; 