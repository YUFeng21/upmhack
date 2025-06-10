import React from 'react';
import {
  List as MuiList,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemButton,
  Divider,
  Box,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledList = styled(MuiList)(({ theme }) => ({
  padding: theme.spacing(1),
  '& .MuiListItem-root': {
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(0.5),
    '&:last-child': {
      marginBottom: 0,
    },
  },
  '& .MuiListItemButton-root': {
    borderRadius: theme.shape.borderRadius,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    '&.Mui-selected': {
      backgroundColor: `${theme.palette.primary.main}15`,
      '&:hover': {
        backgroundColor: `${theme.palette.primary.main}25`,
      },
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
  '& .MuiListItemText-secondary': {
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
  },
}));

const List = ({
  children,
  dense = false,
  disablePadding = false,
  ...props
}) => {
  return (
    <StyledList
      dense={dense}
      disablePadding={disablePadding}
      {...props}
    >
      {children}
    </StyledList>
  );
};

const ListItemWithIcon = ({
  primary,
  secondary,
  icon,
  action,
  selected = false,
  onClick,
  ...props
}) => {
  const content = (
    <>
      {icon && <ListItemIcon>{icon}</ListItemIcon>}
      <ListItemText
        primary={primary}
        secondary={secondary}
      />
      {action && (
        <ListItemSecondaryAction>
          {action}
        </ListItemSecondaryAction>
      )}
    </>
  );

  if (onClick) {
    return (
      <ListItemButton
        selected={selected}
        onClick={onClick}
        {...props}
      >
        {content}
      </ListItemButton>
    );
  }

  return (
    <ListItem {...props}>
      {content}
    </ListItem>
  );
};

List.Item = ListItemWithIcon;
List.Divider = Divider;

export default List; 