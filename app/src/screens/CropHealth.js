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
  MenuItem,
  LinearProgress
} from '@mui/material';
import {
  LocalFlorist as PlantIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  HealthAndSafety as HealthIcon
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { db } from '../config/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const HealthAssessment = ({ assessment, onUpdate, onDelete }) => {
  const getHealthColor = (health) => {
    switch (health.toLowerCase()) {
      case 'excellent':
        return 'success';
      case 'good':
        return 'info';
      case 'fair':
        return 'warning';
      case 'poor':
        return 'error';
      default:
        return 'default';
    }
  };

  const getGrowthStage = (stage) => {
    switch (stage.toLowerCase()) {
      case 'seedling':
        return 25;
      case 'vegetative':
        return 50;
      case 'flowering':
        return 75;
      case 'fruiting':
        return 90;
      case 'mature':
        return 100;
      default:
        return 0;
    }
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PlantIcon color="primary" />
            <Typography variant="h6">
              {assessment.cropName}
            </Typography>
          </Box>
          <Box>
            <IconButton size="small" onClick={() => onUpdate(assessment)}>
              <EditIcon />
            </IconButton>
            <IconButton size="small" onClick={() => onDelete(assessment.id)}>
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" paragraph>
          Variety: {assessment.variety}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Growth Stage: {assessment.growthStage}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={getGrowthStage(assessment.growthStage)}
            sx={{ height: 8, borderRadius: 4, mb: 1 }}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Health Assessment:
          </Typography>
          <Typography variant="body2" paragraph>
            {assessment.assessment}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            icon={<HealthIcon />}
            label={`Health: ${assessment.health}`}
            color={getHealthColor(assessment.health)}
            size="small"
          />
          <Chip
            label={`Assessed: ${new Date(assessment.assessmentDate).toLocaleDateString()}`}
            variant="outlined"
            size="small"
          />
        </Box>

        {assessment.image && (
          <Box sx={{ mt: 2 }}>
            <CardMedia
              component="img"
              height="140"
              image={assessment.image}
              alt={assessment.cropName}
              sx={{ borderRadius: 1 }}
            />
          </Box>
        )}

        {assessment.recommendations && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Recommendations:
            </Typography>
            <Typography variant="body2">
              {assessment.recommendations}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

const HealthAssessmentDialog = ({ open, onClose, assessment, onSave }) => {
  const [formData, setFormData] = useState({
    cropName: '',
    variety: '',
    growthStage: 'seedling',
    health: 'good',
    assessment: '',
    recommendations: '',
    assessmentDate: new Date().toISOString().split('T')[0],
    image: ''
  });

  useEffect(() => {
    if (assessment) {
      setFormData({
        ...assessment,
        assessmentDate: assessment.assessmentDate.split('T')[0]
      });
    } else {
      setFormData({
        cropName: '',
        variety: '',
        growthStage: 'seedling',
        health: 'good',
        assessment: '',
        recommendations: '',
        assessmentDate: new Date().toISOString().split('T')[0],
        image: ''
      });
    }
  }, [assessment]);

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
      assessmentDate: new Date(formData.assessmentDate).toISOString()
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{assessment ? 'Edit Health Assessment' : 'New Health Assessment'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="cropName"
            label="Crop Name"
            type="text"
            fullWidth
            required
            value={formData.cropName}
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
            name="growthStage"
            label="Growth Stage"
            select
            fullWidth
            required
            value={formData.growthStage}
            onChange={handleChange}
          >
            <MenuItem value="seedling">Seedling</MenuItem>
            <MenuItem value="vegetative">Vegetative</MenuItem>
            <MenuItem value="flowering">Flowering</MenuItem>
            <MenuItem value="fruiting">Fruiting</MenuItem>
            <MenuItem value="mature">Mature</MenuItem>
          </TextField>
          <TextField
            margin="dense"
            name="health"
            label="Health Status"
            select
            fullWidth
            required
            value={formData.health}
            onChange={handleChange}
          >
            <MenuItem value="excellent">Excellent</MenuItem>
            <MenuItem value="good">Good</MenuItem>
            <MenuItem value="fair">Fair</MenuItem>
            <MenuItem value="poor">Poor</MenuItem>
          </TextField>
          <TextField
            margin="dense"
            name="assessment"
            label="Health Assessment"
            multiline
            rows={3}
            fullWidth
            required
            value={formData.assessment}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="recommendations"
            label="Recommendations"
            multiline
            rows={2}
            fullWidth
            value={formData.recommendations}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="assessmentDate"
            label="Assessment Date"
            type="date"
            fullWidth
            required
            value={formData.assessmentDate}
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
            {assessment ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const CropHealth = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const { user } = useAuth();

  const loadHealthAssessments = useCallback(async () => {
    try {
      const assessmentsRef = collection(db, 'users', user.uid, 'cropHealth');
      const snapshot = await getDocs(assessmentsRef);
      const assessmentsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAssessments(assessmentsList);
    } catch (error) {
      setError('Failed to load health assessments: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [user.uid]);

  useEffect(() => {
    loadHealthAssessments();
  }, [loadHealthAssessments]);

  const handleAddAssessment = () => {
    setSelectedAssessment(null);
    setDialogOpen(true);
  };

  const handleEditAssessment = (assessment) => {
    setSelectedAssessment(assessment);
    setDialogOpen(true);
  };

  const handleDeleteAssessment = async (assessmentId) => {
    if (window.confirm('Are you sure you want to delete this health assessment?')) {
      try {
        await deleteDoc(doc(db, 'users', user.uid, 'cropHealth', assessmentId));
        setAssessments(assessments.filter(assessment => assessment.id !== assessmentId));
      } catch (error) {
        setError('Failed to delete assessment: ' + error.message);
      }
    }
  };

  const handleSaveAssessment = async (assessmentData) => {
    try {
      if (selectedAssessment) {
        // Update existing assessment
        await updateDoc(doc(db, 'users', user.uid, 'cropHealth', selectedAssessment.id), assessmentData);
        setAssessments(assessments.map(assessment => 
          assessment.id === selectedAssessment.id ? { ...assessment, ...assessmentData } : assessment
        ));
      } else {
        // Add new assessment
        const docRef = await addDoc(collection(db, 'users', user.uid, 'cropHealth'), assessmentData);
        setAssessments([...assessments, { id: docRef.id, ...assessmentData }]);
      }
      setDialogOpen(false);
    } catch (error) {
      setError('Failed to save assessment: ' + error.message);
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
          Crop Health
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddAssessment}
        >
          New Assessment
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {assessments.map(assessment => (
          <Grid item xs={12} sm={6} md={4} key={assessment.id}>
            <HealthAssessment
              assessment={assessment}
              onUpdate={handleEditAssessment}
              onDelete={handleDeleteAssessment}
            />
          </Grid>
        ))}
      </Grid>

      {assessments.length === 0 && (
        <Alert severity="info" sx={{ mt: 3 }}>
          No health assessments available. Click "New Assessment" to add one.
        </Alert>
      )}

      <HealthAssessmentDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        assessment={selectedAssessment}
        onSave={handleSaveAssessment}
      />
    </Box>
  );
};

export default CropHealth; 