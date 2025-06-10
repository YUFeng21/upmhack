import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Alert
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { db } from '../config/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';
import { useMqttStore } from '../services/mqttService';

const FarmCard = ({ farm, onEdit, onDelete }) => {
  const { temperature, humidity, soilMoisture } = useMqttStore();

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="140"
        image={farm.image || '/images/farm1.jpg'}
        alt={farm.name}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography gutterBottom variant="h6" component="div">
            {farm.name}
          </Typography>
          <Box>
            <IconButton size="small" onClick={() => onEdit(farm)}>
              <EditIcon />
            </IconButton>
            <IconButton size="small" onClick={() => onDelete(farm.id)}>
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
        <Typography variant="body2" color="text.secondary" paragraph>
          {farm.location}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Size: {farm.size} acres
        </Typography>
        
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Current Conditions:
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={4}>
              <Typography variant="body2" color="text.secondary">
                Temp: {temperature}°C
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body2" color="text.secondary">
                Humidity: {humidity}%
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body2" color="text.secondary">
                Soil: {soilMoisture}%
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

const FarmDialog = ({ open, onClose, farm, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    size: '',
    image: ''
  });

  useEffect(() => {
    if (farm) {
      setFormData(farm);
    }
  }, [farm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{farm ? 'Edit Farm' : 'Add New Farm'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Farm Name"
            type="text"
            fullWidth
            required
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="location"
            label="Location"
            type="text"
            fullWidth
            required
            value={formData.location}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="size"
            label="Size (acres)"
            type="number"
            fullWidth
            required
            value={formData.size}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="image"
            label="Image URL"
            type="text"
            fullWidth
            value={formData.image}
            onChange={handleChange}
            helperText="Leave empty to use default image"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {farm ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const MyFarm = () => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const { user } = useAuth();

  const loadFarms = useCallback(async () => {
    try {
      const farmsRef = collection(db, 'users', user.uid, 'farms');
      const snapshot = await getDocs(farmsRef);
      const farmsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFarms(farmsList);
    } catch (error) {
      setError('Failed to load farms: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [user.uid]);

  useEffect(() => {
    loadFarms();
  }, [loadFarms]);

  const handleAddFarm = () => {
    setSelectedFarm(null);
    setDialogOpen(true);
  };

  const handleEditFarm = (farm) => {
    setSelectedFarm(farm);
    setDialogOpen(true);
  };

  const handleDeleteFarm = async (farmId) => {
    if (window.confirm('Are you sure you want to delete this farm?')) {
      try {
        await deleteDoc(doc(db, 'users', user.uid, 'farms', farmId));
        setFarms(farms.filter(farm => farm.id !== farmId));
      } catch (error) {
        setError('Failed to delete farm: ' + error.message);
      }
    }
  };

  const handleSaveFarm = async (farmData) => {
    try {
      if (selectedFarm) {
        // Update existing farm
        await updateDoc(doc(db, 'users', user.uid, 'farms', selectedFarm.id), farmData);
        setFarms(farms.map(farm => 
          farm.id === selectedFarm.id ? { ...farm, ...farmData } : farm
        ));
      } else {
        // Add new farm
        const docRef = await addDoc(collection(db, 'users', user.uid, 'farms'), farmData);
        setFarms([...farms, { id: docRef.id, ...farmData }]);
      }
      setDialogOpen(false);
    } catch (error) {
      setError('Failed to save farm: ' + error.message);
    }
  };

  if (loading) {
    return <Typography>Loading farms...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          My Farms
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddFarm}
        >
          Add Farm
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {farms.map(farm => (
          <Grid item xs={12} sm={6} md={4} key={farm.id}>
            <FarmCard
              farm={farm}
              onEdit={handleEditFarm}
              onDelete={handleDeleteFarm}
            />
          </Grid>
        ))}
      </Grid>

      <FarmDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        farm={selectedFarm}
        onSave={handleSaveFarm}
      />
    </Box>
  );
};

export default MyFarm; 