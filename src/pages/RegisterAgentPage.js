import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Paper,
  Chip,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  FormHelperText,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import EditIcon from '@mui/icons-material/Edit';
import { useAgents } from '../context/AgentContext';

const categories = [
  'Text Generation',
  'Image Generation',
  'Code Assistant',
  'Data Analysis',
  'Conversational',
  'Translation',
  'Summarization',
  'Other'
];

const RegisterAgentPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the agent ID from URL if editing
  const { agents, addAgent, updateAgent, loading, error } = useAgents();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    capabilities: [],
    jarFileLocation: '',
    apiEndpoint: '',
    apiKey: '',
    isEnabled: true,
    imageUrl: '',
  });
  
  const [capability, setCapability] = useState('');
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [pageLoading, setPageLoading] = useState(isEditMode);

  // Load agent data if in edit mode
  useEffect(() => {
    if (isEditMode && agents.length > 0) {
      const agentToEdit = agents.find(agent => agent.id === parseInt(id));
      if (agentToEdit) {
        setFormData(agentToEdit);
        setPageLoading(false);
      } else {
        // Agent not found, redirect to home
        navigate('/');
      }
    } else {
      setPageLoading(false);
    }
  }, [isEditMode, id, agents, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleAddCapability = () => {
    if (capability.trim() !== '' && !formData.capabilities.includes(capability.trim())) {
      setFormData({
        ...formData,
        capabilities: [...formData.capabilities, capability.trim()],
      });
      setCapability('');
      
      // Clear capabilities error if it exists
      if (errors.capabilities) {
        setErrors({
          ...errors,
          capabilities: '',
        });
      }
    }
  };

  const handleRemoveCapability = (capToRemove) => {
    setFormData({
      ...formData,
      capabilities: formData.capabilities.filter(cap => cap !== capToRemove),
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description should be at least 20 characters';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (formData.capabilities.length === 0) {
      newErrors.capabilities = 'At least one capability is required';
    }
    
    // Only validate API Endpoint format if it's provided
    if (formData.apiEndpoint.trim() && !formData.apiEndpoint.startsWith('http')) {
      newErrors.apiEndpoint = 'API Endpoint must be a valid URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setSubmitting(true);
      
      try {
        if (isEditMode) {
          // Update existing agent
          await updateAgent(formData);
        } else {
          // Add new agent
          await addAgent(formData);
        }
        
        // Show success message
        setSubmitted(true);
        
        // Reset form after 2 seconds and redirect to home
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } catch (err) {
        console.error('Error submitting form:', err);
      } finally {
        setSubmitting(false);
      }
    }
  };

  if (pageLoading || loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          {isEditMode ? 'Edit Agent' : 'Register New Agent'}
        </Typography>
        <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 4 }}>
          {isEditMode ? 'Update the details of your GenAI agent' : 'Add your GenAI agent to the marketplace'}
        </Typography>
        
        <Divider sx={{ mb: 4 }} />
        
        {submitted && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Agent successfully {isEditMode ? 'updated' : 'registered'}! Redirecting to home page...
          </Alert>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Agent Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                required
                disabled={submitting}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
                error={!!errors.description}
                helperText={errors.description}
                required
                disabled={submitting}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.category} required disabled={submitting}>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  label="Category"
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
                {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Image URL (optional)"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                disabled={submitting}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ mb: 1 }}>
                <InputLabel sx={{ mb: 1 }}>Capabilities</InputLabel>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <TextField
                    fullWidth
                    placeholder="Add a capability"
                    value={capability}
                    onChange={(e) => setCapability(e.target.value)}
                    error={!!errors.capabilities}
                    sx={{ mr: 1 }}
                    disabled={submitting}
                  />
                  <Button 
                    variant="contained" 
                    onClick={handleAddCapability}
                    disabled={!capability.trim() || submitting}
                  >
                    Add
                  </Button>
                </Box>
                {errors.capabilities && (
                  <FormHelperText error>{errors.capabilities}</FormHelperText>
                )}
              </Box>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 2 }}>
                {formData.capabilities.map((cap, index) => (
                  <Chip
                    key={index}
                    label={cap}
                    onDelete={() => handleRemoveCapability(cap)}
                    color="primary"
                    variant="outlined"
                    disabled={submitting}
                  />
                ))}
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Jar File Location"
                name="jarFileLocation"
                value={formData.jarFileLocation}
                onChange={handleChange}
                placeholder="Path to your JAR file"
                disabled={submitting}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="API Endpoint"
                name="apiEndpoint"
                value={formData.apiEndpoint}
                onChange={handleChange}
                error={!!errors.apiEndpoint}
                helperText={errors.apiEndpoint}
                placeholder="https://api.example.com/agent (optional)"
                disabled={submitting}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="API Key (optional)"
                name="apiKey"
                value={formData.apiKey || ''}
                onChange={handleChange}
                type="password"
                placeholder="Your API key for authentication"
                disabled={submitting}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  type="submit"
                  startIcon={submitting ? <CircularProgress size={24} color="inherit" /> : isEditMode ? <EditIcon /> : <CloudUploadIcon />}
                  sx={{ px: 4, py: 1.5 }}
                  disabled={submitting}
                >
                  {submitting 
                    ? 'Saving...' 
                    : isEditMode 
                      ? 'Update Agent' 
                      : 'Register Agent'
                  }
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default RegisterAgentPage;
