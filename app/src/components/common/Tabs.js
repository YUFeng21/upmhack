import React from 'react';
import { Tabs as MuiTabs, Tab, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledTabs = styled(MuiTabs)(({ theme }) => ({
  minHeight: 48,
  '& .MuiTabs-indicator': {
    height: 3,
    borderRadius: '3px 3px 0 0',
  },
  '& .MuiTabs-flexContainer': {
    gap: theme.spacing(2),
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  minHeight: 48,
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '0.875rem',
  padding: theme.spacing(1, 2),
  minWidth: 0,
  '&.Mui-selected': {
    color: theme.palette.primary.main,
  },
  '&.MuiTab-root': {
    color: theme.palette.text.secondary,
  },
}));

const Tabs = ({
  value,
  onChange,
  children,
  variant = 'standard',
  centered = false,
  ...props
}) => {
  return (
    <StyledTabs
      value={value}
      onChange={onChange}
      variant={variant}
      centered={centered}
      {...props}
    >
      {children}
    </StyledTabs>
  );
};

const Tab = ({
  label,
  icon,
  iconPosition = 'start',
  disabled = false,
  ...props
}) => {
  return (
    <StyledTab
      label={label}
      icon={icon}
      iconPosition={iconPosition}
      disabled={disabled}
      {...props}
    />
  );
};

const TabPanel = ({
  children,
  value,
  index,
  ...props
}) => {
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...props}
    >
      {value === index && children}
    </Box>
  );
};

Tabs.Tab = Tab;
Tabs.Panel = TabPanel;

export default Tabs; 