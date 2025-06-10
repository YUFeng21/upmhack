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
  Alert,
  LinearProgress,
  Chip
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { db } from '../config/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';

const CropCard = ({ crop, onEdit, onDelete }) => {
  const calculateProgress = () => {
    const planted = new Date(crop.plantedDate);
    const harvest = new Date(crop.expectedHarvestDate);
    const today = new Date();
    const total = harvest - planted;
    const current = today - planted;
    return Math.min(Math.max((current / total) * 100, 0), 100);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'healthy':
        return 'success';
      case 'warning':
        return 'warning';
      case 'critical':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="140"
        image={crop.image || '/images/crop1.jpg'}
        alt={crop.name}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography gutterBottom variant="h6" component="div">
            {crop.name}
          </Typography>
          <Box>
            <IconButton size="small" onClick={() => onEdit(crop)}>
              <EditIcon />
            </IconButton>
            <IconButton size="small" onClick={() => onDelete(crop.id)}>
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" paragraph>
          Variety: {crop.variety}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Growth Progress
          </Typography>
          <LinearProgress
            variant="determinate"
            value={calculateProgress()}
            sx={{ mt: 1, mb: 0.5 }}
          />
          <Typography variant="caption" color="text.secondary">
            {Math.round(calculateProgress())}% Complete
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
          <Chip
            label={crop.status}
            color={getStatusColor(crop.status)}
            size="small"
          />
          <Chip
            label={`Planted: ${new Date(crop.plantedDate).toLocaleDateString()}`}
            variant="outlined"
            size="small"
          />
          <Chip
            label={`Harvest: ${new Date(crop.expectedHarvestDate).toLocaleDateString()}`}
            variant="outlined"
            size="small"
          />
        </Box>
      </CardContent>
    </Card>
  );
};

const CropDialog = ({ open, onClose, crop, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    variety: '',
    plantedDate: '',
    expectedHarvestDate: '',
    status: 'Healthy',
    image: ''
  });

  useEffect(() => {
    if (crop) {
      setFormData({
        ...crop,
        plantedDate: crop.plantedDate.split('T')[0],
        expectedHarvestDate: crop.expectedHarvestDate.split('T')[0]
      });
    } else {
      setFormData({
        name: '',
        variety: '',
        plantedDate: new Date().toISOString().split('T')[0],
        expectedHarvestDate: '',
        status: 'Healthy',
        image: ''
      });
    }
  }, [crop]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      plantedDate: new Date(formData.plantedDate).toISOString(),
      expectedHarvestDate: new Date(formData.expectedHarvestDate).toISOString()
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{crop ? 'Edit Crop' : 'Add New Crop'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Crop Name"
            type="text"
            fullWidth
            required
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="variety"
            label="Variety"
            type="text"
            fullWidth
            required
            value={formData.variety}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="plantedDate"
            label="Planted Date"
            type="date"
            fullWidth
            required
            value={formData.plantedDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            name="expectedHarvestDate"
            label="Expected Harvest Date"
            type="date"
            fullWidth
            required
            value={formData.expectedHarvestDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            name="status"
            label="Status"
            select
            fullWidth
            required
            value={formData.status}
            onChange={handleChange}
            SelectProps={{ native: true }}
          >
            <option value="Healthy">Healthy</option>
            <option value="Warning">Warning</option>
            <option value="Critical">Critical</option>
          </TextField>
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
            {crop ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const MyCrops = () => {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const { user } = useAuth();

  const loadCrops = useCallback(async () => {
    try {
      const cropsRef = collection(db, 'users', user.uid, 'crops');
      const snapshot = await getDocs(cropsRef);
      const cropsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCrops(cropsList);
    } catch (error) {
      setError('Failed to load crops: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [user.uid]);

  useEffect(() => {
    loadCrops();
  }, [loadCrops]);

  const handleAddCrop = () => {
    setSelectedCrop(null);
    setDialogOpen(true);
  };

  const handleEditCrop = (crop) => {
    setSelectedCrop(crop);
    setDialogOpen(true);
  };

  const handleDeleteCrop = async (cropId) => {
    if (window.confirm('Are you sure you want to delete this crop?')) {
      try {
        await deleteDoc(doc(db, 'users', user.uid, 'crops', cropId));
        setCrops(crops.filter(crop => crop.id !== cropId));
      } catch (error) {
        setError('Failed to delete crop: ' + error.message);
      }
    }
  };

  const handleSaveCrop = async (cropData) => {
    try {
      if (selectedCrop) {
        // Update existing crop
        await updateDoc(doc(db, 'users', user.uid, 'crops', selectedCrop.id), cropData);
        setCrops(crops.map(crop => 
          crop.id === selectedCrop.id ? { ...crop, ...cropData } : crop
        ));
      } else {
        // Add new crop
        const docRef = await addDoc(collection(db, 'users', user.uid, 'crops'), cropData);
        setCrops([...crops, { id: docRef.id, ...cropData }]);
      }
      setDialogOpen(false);
    } catch (error) {
      setError('Failed to save crop: ' + error.message);
    }
  };

  if (loading) {
    return <Typography>Loading crops...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          My Crops
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddCrop}
        >
          Add Crop
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {crops.map(crop => (
          <Grid item xs={12} sm={6} md={4} key={crop.id}>
            <CropCard
              crop={crop}
              onEdit={handleEditCrop}
              onDelete={handleDeleteCrop}
            />
          </Grid>
        ))}
      </Grid>

      <CropDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        crop={selectedCrop}
        onSave={handleSaveCrop}
      />
    </Box>
  );
};

export default MyCrops; 