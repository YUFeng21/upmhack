import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const SensorCard = ({ title, value, color, icon }) => {
  return (
    <Card
      sx={{
        mb: 2,
        backgroundColor: `${color}15`, // 15% opacity
        borderRadius: 2,
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                backgroundColor: `${color}30`, // 30% opacity
                borderRadius: '50%',
                p: 1,
                mr: 2,
              }}
            >
              {icon}
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {title}
            </Typography>
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              color: color,
            }}
          >
            {value}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SensorCard; 