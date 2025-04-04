const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Path to data file
const dataFilePath = path.join(__dirname, 'data', 'agents.json');

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Initialize file if it doesn't exist
if (!fs.existsSync(dataFilePath)) {
  // Import mock data
  const { mockAgents } = require('./src/data/mockData');
  fs.writeFileSync(dataFilePath, JSON.stringify(mockAgents, null, 2));
}

// GET endpoint to retrieve all agents
app.get('/api/agents', (req, res) => {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading file:', error);
    res.status(500).json({ error: 'Failed to read agents data' });
  }
});

// POST endpoint to add a new agent
app.post('/api/agents', (req, res) => {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    const agents = JSON.parse(data);
    
    // Generate new ID
    const newId = Math.max(...agents.map(agent => agent.id), 0) + 1;
    const newAgent = { ...req.body, id: newId };
    
    // Add new agent
    agents.push(newAgent);
    
    // Write updated data back to file
    fs.writeFileSync(dataFilePath, JSON.stringify(agents, null, 2));
    
    res.status(201).json(newAgent);
  } catch (error) {
    console.error('Error writing file:', error);
    res.status(500).json({ error: 'Failed to add agent' });
  }
});

// PUT endpoint to update agent status
app.put('/api/agents/:id', (req, res) => {
  try {
    const agentId = parseInt(req.params.id);
    const data = fs.readFileSync(dataFilePath, 'utf8');
    let agents = JSON.parse(data);
    
    // Find and update agent
    const agentIndex = agents.findIndex(agent => agent.id === agentId);
    if (agentIndex === -1) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    
    agents[agentIndex] = { ...agents[agentIndex], ...req.body };
    
    // Write updated data back to file
    fs.writeFileSync(dataFilePath, JSON.stringify(agents, null, 2));
    
    res.json(agents[agentIndex]);
  } catch (error) {
    console.error('Error updating file:', error);
    res.status(500).json({ error: 'Failed to update agent' });
  }
});

// DELETE endpoint to remove an agent
app.delete('/api/agents/:id', (req, res) => {
  try {
    const agentId = parseInt(req.params.id);
    const data = fs.readFileSync(dataFilePath, 'utf8');
    let agents = JSON.parse(data);
    
    // Check if agent exists
    const agentIndex = agents.findIndex(agent => agent.id === agentId);
    if (agentIndex === -1) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    
    // Remove agent
    agents = agents.filter(agent => agent.id !== agentId);
    
    // Write updated data back to file
    fs.writeFileSync(dataFilePath, JSON.stringify(agents, null, 2));
    
    res.status(200).json({ message: 'Agent deleted successfully' });
  } catch (error) {
    console.error('Error deleting agent:', error);
    res.status(500).json({ error: 'Failed to delete agent' });
  }
});

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
