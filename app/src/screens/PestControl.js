import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Alert,
  CircularProgress,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem
} from '@mui/material';
import {
  BugReport as BugReportIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { db } from '../config/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const PestAlert = ({ alert, onUpdate, onDelete }) => {
  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'error';
      case 'investigating':
        return 'warning';
      case 'resolved':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BugReportIcon color="error" />
            <Typography variant="h6">
              {alert.pestType}
            </Typography>
          </Box>
          <Box>
            <IconButton size="small" onClick={() => onUpdate(alert)}>
              <EditIcon />
            </IconButton>
            <IconButton size="small" onClick={() => onDelete(alert.id)}>
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" paragraph>
          Location: {alert.location}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Description:
          </Typography>
          <Typography variant="body2" paragraph>
            {alert.description}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            icon={<WarningIcon />}
            label={`Severity: ${alert.severity}`}
            color={getSeverityColor(alert.severity)}
            size="small"
          />
          <Chip
            label={`Status: ${alert.status}`}
            color={getStatusColor(alert.status)}
            size="small"
          />
          <Chip
            label={`Detected: ${new Date(alert.detectedDate).toLocaleDateString()}`}
            variant="outlined"
            size="small"
          />
        </Box>

        {alert.image && (
          <Box sx={{ mt: 2 }}>
            <CardMedia
              component="img"
              height="140"
              image={alert.image}
              alt={alert.pestType}
              sx={{ borderRadius: 1 }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

const PestAlertDialog = ({ open, onClose, alert, onSave }) => {
  const [formData, setFormData] = useState({
    pestType: '',
    location: '',
    description: '',
    severity: 'low',
    status: 'active',
    detectedDate: new Date().toISOString().split('T')[0],
    image: ''
  });

  useEffect(() => {
    if (alert) {
      setFormData({
        ...alert,
        detectedDate: alert.detectedDate.split('T')[0]
      });
    } else {
      setFormData({
        pestType: '',
        location: '',
        description: '',
        severity: 'low',
        status: 'active',
        detectedDate: new Date().toISOString().split('T')[0],
        image: ''
      });
    }
  }, [alert]);

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
      detectedDate: new Date(formData.detectedDate).toISOString()
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{alert ? 'Edit Pest Alert' : 'New Pest Alert'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="pestType"
            label="Pest Type"
            type="text"
            fullWidth
            required
            value={formData.pestType}
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
            name="description"
            label="Description"
            multiline
            rows={3}
            fullWidth
            required
            value={formData.description}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="severity"
            label="Severity"
            select
            fullWidth
            required
            value={formData.severity}
            onChange={handleChange}
          >
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
          </TextField>
          <TextField
            margin="dense"
            name="status"
            label="Status"
            select
            fullWidth
            required
            value={formData.status}
            onChange={handleChange}
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="investigating">Investigating</MenuItem>
            <MenuItem value="resolved">Resolved</MenuItem>
          </TextField>
          <TextField
            margin="dense"
            name="detectedDate"
            label="Detected Date"
            type="date"
            fullWidth
            required
            value={formData.detectedDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            name="image"
            label="Image URL"
            type="text"
            fullWidth
            value={formData.image}
            onChange={handleChange}
            helperText="Leave empty if no image available"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {alert ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const PestControl = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const { user } = useAuth();

  const loadPestAlerts = useCallback(async () => {
    try {
      const alertsRef = collection(db, 'users', user.uid, 'pestAlerts');
      const snapshot = await getDocs(alertsRef);
      const alertsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAlerts(alertsList);
    } catch (error) {
      setError('Failed to load pest alerts: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [user.uid]);

  useEffect(() => {
    loadPestAlerts();
  }, [loadPestAlerts]);

  const handleAddAlert = () => {
    setSelectedAlert(null);
    setDialogOpen(true);
  };

  const handleEditAlert = (alert) => {
    setSelectedAlert(alert);
    setDialogOpen(true);
  };

  const handleDeleteAlert = async (alertId) => {
    if (window.confirm('Are you sure you want to delete this pest alert?')) {
      try {
        await deleteDoc(doc(db, 'users', user.uid, 'pestAlerts', alertId));
        setAlerts(alerts.filter(alert => alert.id !== alertId));
      } catch (error) {
        setError('Failed to delete alert: ' + error.message);
      }
    }
  };

  const handleSaveAlert = async (alertData) => {
    try {
      if (selectedAlert) {
        // Update existing alert
        await updateDoc(doc(db, 'users', user.uid, 'pestAlerts', selectedAlert.id), alertData);
        setAlerts(alerts.map(alert => 
          alert.id === selectedAlert.id ? { ...alert, ...alertData } : alert
        ));
      } else {
        // Add new alert
        const docRef = await addDoc(collection(db, 'users', user.uid, 'pestAlerts'), alertData);
        setAlerts([...alerts, { id: docRef.id, ...alertData }]);
      }
      setDialogOpen(false);
    } catch (error) {
      setError('Failed to save alert: ' + error.message);
    }
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          Pest Control
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddAlert}
        >
          New Alert
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {alerts.map(alert => (
          <Grid item xs={12} sm={6} md={4} key={alert.id}>
            <PestAlert
              alert={alert}
              onUpdate={handleEditAlert}
              onDelete={handleDeleteAlert}
            />
          </Grid>
        ))}
      </Grid>

      {alerts.length === 0 && (
        <Alert severity="info" sx={{ mt: 3 }}>
          No pest alerts reported. Click "New Alert" to report a pest issue.
        </Alert>
      )}

      <PestAlertDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        alert={selectedAlert}
        onSave={handleSaveAlert}
      />
    </Box>
  );
};

export default PestControl; 