import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Box, 
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AgentCard from '../components/AgentCard';
import { useAgents } from '../context/AgentContext';

const HomePage = () => {
  const { agents, loading, error, toggleAgentStatus } = useAgents();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const handleToggleStatus = (agentId) => {
    toggleAgentStatus(agentId);
  };

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  // Show error message if there's an error
  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  // Filter agents based on search term and filters
  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          agent.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || agent.category === categoryFilter;
    
    const matchesStatus = statusFilter === 'all' || 
                          (statusFilter === 'enabled' && agent.isEnabled) ||
                          (statusFilter === 'disabled' && !agent.isEnabled);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Get unique categories for filter dropdown
  const categories = ['all', ...new Set(agents.map(agent => agent.category))];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 3 }}>
          GenAI Agents Marketplace
        </Typography>
        <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 4 }}>
          Discover and manage AI agents for your specific needs
        </Typography>
      </Box>

      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search agents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel id="category-filter-label">Category</InputLabel>
              <Select
                labelId="category-filter-label"
                value={categoryFilter}
                label="Category"
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel id="status-filter-label">Status</InputLabel>
              <Select
                labelId="status-filter-label"
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="enabled">Enabled</MenuItem>
                <MenuItem value="disabled">Disabled</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" component="h2">
          {filteredAgents.length} {filteredAgents.length === 1 ? 'Agent' : 'Agents'} Available
        </Typography>
        <Divider sx={{ my: 2 }} />
      </Box>

      <Grid container spacing={3}>
        {filteredAgents.length > 0 ? (
          filteredAgents.map((agent) => (
            <Grid item key={agent.id} xs={12} sm={6} md={4}>
              <AgentCard agent={agent} onToggleStatus={handleToggleStatus} />
            </Grid>
          ))
        ) : (
          <Box sx={{ py: 5, textAlign: 'center', width: '100%' }}>
            <Typography variant="h6" color="text.secondary">
              No agents found matching your criteria
            </Typography>
          </Box>
        )}
      </Grid>
    </Container>
  );
};

export default HomePage;
