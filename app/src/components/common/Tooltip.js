import React from 'react';
import { Tooltip as MuiTooltip } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledTooltip = styled(MuiTooltip)(({ theme }) => ({
  '& .MuiTooltip-tooltip': {
    backgroundColor: theme.palette.grey[800],
    color: theme.palette.common.white,
    fontSize: '0.75rem',
    padding: theme.spacing(1, 1.5),
    borderRadius: theme.shape.borderRadius,
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    maxWidth: 300,
    '&.MuiTooltip-tooltipPlacementTop': {
      margin: '0 0 8px 0',
    },
    '&.MuiTooltip-tooltipPlacementBottom': {
      margin: '8px 0 0 0',
    },
    '&.MuiTooltip-tooltipPlacementLeft': {
      margin: '0 8px 0 0',
    },
    '&.MuiTooltip-tooltipPlacementRight': {
      margin: '0 0 0 8px',
    },
  },
  '& .MuiTooltip-arrow': {
    color: theme.palette.grey[800],
  },
}));

const Tooltip = ({
  title,
  children,
  placement = 'top',
  arrow = true,
  enterDelay = 200,
  leaveDelay = 0,
  ...props
}) => {
  if (!title) {
    return children;
  }

  return (
    <StyledTooltip
      title={title}
      placement={placement}
      arrow={arrow}
      enterDelay={enterDelay}
      leaveDelay={leaveDelay}
      {...props}
    >
      {children}
    </StyledTooltip>
  );
};

export default Tooltip; 