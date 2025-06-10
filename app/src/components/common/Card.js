import React from 'react';
import { Card as MuiCard, CardContent, CardHeader, CardActions, Typography, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(MuiCard)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  transition: theme.transitions.create(['transform', 'box-shadow']),
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
  '& .MuiCardHeader-root': {
    padding: theme.spacing(2),
    '& .MuiCardHeader-title': {
      fontSize: '1.1rem',
      fontWeight: 600,
    },
    '& .MuiCardHeader-subheader': {
      fontSize: '0.875rem',
      color: theme.palette.text.secondary,
    },
  },
  '& .MuiCardContent-root': {
    padding: theme.spacing(2),
    '&:last-child': {
      paddingBottom: theme.spacing(2),
    },
  },
  '& .MuiCardActions-root': {
    padding: theme.spacing(1, 2),
    justifyContent: 'flex-end',
  },
}));

const Card = ({
  title,
  subheader,
  children,
  action,
  actions,
  onClick,
  elevation = 1,
  ...props
}) => {
  return (
    <StyledCard
      elevation={elevation}
      onClick={onClick}
      sx={{
        cursor: onClick ? 'pointer' : 'default',
        ...props.sx,
      }}
      {...props}
    >
      {(title || subheader || action) && (
        <CardHeader
          title={title}
          subheader={subheader}
          action={
            action && (
              <IconButton aria-label="settings" onClick={(e) => {
                e.stopPropagation();
                action.onClick(e);
              }}>
                {action.icon}
              </IconButton>
            )
          }
        />
      )}
      <CardContent>
        {typeof children === 'string' ? (
          <Typography variant="body2" color="text.secondary">
            {children}
          </Typography>
        ) : (
          children
        )}
      </CardContent>
      {actions && actions.length > 0 && (
        <CardActions>
          {actions.map((action, index) => (
            <IconButton
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                action.onClick(e);
              }}
              color={action.color || 'primary'}
              size="small"
            >
              {action.icon}
            </IconButton>
          ))}
        </CardActions>
      )}
    </StyledCard>
  );
};

export default Card; 