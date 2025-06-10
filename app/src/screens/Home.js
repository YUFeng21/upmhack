import React from 'react';
import { Box, Grid, Typography, Card, CardContent, CardMedia } from '@mui/material';
import { useMqttStore } from '../services/mqttService';
import { useAuth } from '../hooks/useAuth';

const SensorCard = ({ title, value, icon, color }) => (
  <Card sx={{ height: '100%', bgcolor: color + '20' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        {icon}
        <Typography variant="h6" component="div" sx={{ ml: 1 }}>
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
        {value}
      </Typography>
    </CardContent>
  </Card>
);

const Home = () => {
  const { user } = useAuth();
  const { temperature, humidity, lightIntensity, soilMoisture } = useMqttStore();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Welcome back, {user?.displayName || 'Farmer'}!
      </Typography>

      {/* Sensor Data Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <SensorCard
            title="Temperature"
            value={`${temperature}°C`}
            icon={<span style={{ fontSize: '24px' }}>🌡️</span>}
            color="#FFA726"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SensorCard
            title="Humidity"
            value={`${humidity}%`}
            icon={<span style={{ fontSize: '24px' }}>💧</span>}
            color="#42A5F5"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SensorCard
            title="Light"
            value={`${lightIntensity} lux`}
            icon={<span style={{ fontSize: '24px' }}>☀️</span>}
            color="#FFD54F"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SensorCard
            title="Soil Moisture"
            value={`${soilMoisture}%`}
            icon={<span style={{ fontSize: '24px' }}>🌱</span>}
            color="#66BB6A"
          />
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Typography variant="h5" sx={{ mb: 2 }}>
        Quick Actions
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%', cursor: 'pointer' }}>
            <CardMedia
              component="img"
              height="140"
              image="/images/irrigation_banner.png"
              alt="Smart Irrigation"
            />
            <CardContent>
              <Typography gutterBottom variant="h6">
                Smart Irrigation
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Monitor and control your irrigation system
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%', cursor: 'pointer' }}>
            <CardMedia
              component="img"
              height="140"
              image="/images/pest_control_banner.jpg"
              alt="Pest Control"
            />
            <CardContent>
              <Typography gutterBottom variant="h6">
                Pest Control
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Monitor and manage pest control systems
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%', cursor: 'pointer' }}>
            <CardMedia
              component="img"
              height="140"
              image="/images/crop1.jpg"
              alt="Crop Health"
            />
            <CardContent>
              <Typography gutterBottom variant="h6">
                Crop Health
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Analyze crop health and get recommendations
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home; 