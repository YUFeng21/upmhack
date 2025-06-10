import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Switch,
  Slider,
  Button,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  WaterDrop as WaterDropIcon,
  Timer as TimerIcon,
  Settings as SettingsIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import useMqtt from '../hooks/useMqtt';
import { useAuth } from '../hooks/useAuth';
import { db } from '../config/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

const IrrigationZone = ({ zone, onToggle, onScheduleChange, onThresholdChange }) => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WaterDropIcon color="primary" />
            <Typography variant="h6">
              {zone.name}
            </Typography>
          </Box>
          <Box>
            <Tooltip title="Zone Settings">
              <IconButton onClick={() => setShowSettings(!showSettings)}>
                <SettingsIcon />
              </IconButton>
            </Tooltip>
            <Switch
              checked={zone.active}
              onChange={(e) => onToggle(zone.id, e.target.checked)}
              color="primary"
            />
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Current Soil Moisture: {zone.moisture}%
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Moisture Threshold:
            </Typography>
            <Slider
              value={zone.threshold}
              onChange={(_, value) => onThresholdChange(zone.id, value)}
              min={0}
              max={100}
              disabled={!showSettings}
              sx={{ width: 150 }}
            />
            <Typography variant="body2">
              {zone.threshold}%
            </Typography>
          </Box>
        </Box>

        {showSettings && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Schedule
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<TimerIcon />}
                onClick={() => onScheduleChange(zone.id)}
              >
                {zone.schedule ? 'Edit Schedule' : 'Set Schedule'}
              </Button>
              {zone.schedule && (
                <Typography variant="body2">
                  {zone.schedule}
                </Typography>
              )}
            </Box>
          </Box>
        )}

        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <InfoIcon color="action" fontSize="small" />
          <Typography variant="caption" color="text.secondary">
            Last watered: {zone.lastWatered || 'Never'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

const SmartIrrigation = () => {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const { publish } = useMqtt();

  const loadIrrigationZones = useCallback(async () => {
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();
      setZones(userData.irrigationZones || []);
    } catch (error) {
      setError('Failed to load irrigation zones: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [user.uid]);

  useEffect(() => {
    loadIrrigationZones();
  }, [loadIrrigationZones]);

  const handleToggleZone = async (zoneId, active) => {
    try {
      const updatedZones = zones.map(zone =>
        zone.id === zoneId ? { ...zone, active } : zone
      );
      
      await updateDoc(doc(db, 'users', user.uid), {
        irrigationZones: updatedZones
      });

      // Publish MQTT message to control irrigation
      publish(`irrigation/${user.uid}/${zoneId}`, {
        action: active ? 'start' : 'stop',
        timestamp: new Date().toISOString()
      });

      setZones(updatedZones);
    } catch (error) {
      setError('Failed to update zone: ' + error.message);
    }
  };

  const handleThresholdChange = async (zoneId, threshold) => {
    try {
      const updatedZones = zones.map(zone =>
        zone.id === zoneId ? { ...zone, threshold } : zone
      );
      
      await updateDoc(doc(db, 'users', user.uid), {
        irrigationZones: updatedZones
      });

      setZones(updatedZones);
    } catch (error) {
      setError('Failed to update threshold: ' + error.message);
    }
  };

  const handleScheduleChange = async (zoneId) => {
    // Implement schedule dialog/modal here
    // This would allow setting up watering schedules
    console.log('Schedule change for zone:', zoneId);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Smart Irrigation
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {zones.map(zone => (
          <Grid item xs={12} sm={6} md={4} key={zone.id}>
            <IrrigationZone
              zone={zone}
              onToggle={handleToggleZone}
              onScheduleChange={handleScheduleChange}
              onThresholdChange={handleThresholdChange}
            />
          </Grid>
        ))}
      </Grid>

      {zones.length === 0 && (
        <Alert severity="info" sx={{ mt: 3 }}>
          No irrigation zones configured. Add zones in your farm settings.
        </Alert>
      )}
    </Box>
  );
};

export default SmartIrrigation; 