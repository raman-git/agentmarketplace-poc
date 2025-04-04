import React, { createContext, useState, useEffect, useContext } from 'react';

// Create the context
const AgentContext = createContext();

// Custom hook to use the agent context
export const useAgents = () => useContext(AgentContext);

// API base URL
const API_URL = 'http://localhost:3001/api';

// Provider component
export const AgentProvider = ({ children }) => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch agents from API
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch(`${API_URL}/agents`);
        if (!response.ok) {
          throw new Error('Failed to fetch agents');
        }
        const data = await response.json();
        setAgents(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error('Error fetching agents:', err);
      }
    };

    fetchAgents();
  }, []);

  // Add a new agent
  const addAgent = async (newAgent) => {
    try {
      const response = await fetch(`${API_URL}/agents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAgent),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add agent');
      }
      
      const addedAgent = await response.json();
      setAgents([...agents, addedAgent]);
      return addedAgent;
    } catch (err) {
      setError(err.message);
      console.error('Error adding agent:', err);
      return null;
    }
  };

  // Toggle agent status
  const toggleAgentStatus = async (agentId) => {
    try {
      const agent = agents.find(a => a.id === agentId);
      if (!agent) return;
      
      const updatedAgent = { ...agent, isEnabled: !agent.isEnabled };
      
      const response = await fetch(`${API_URL}/agents/${agentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedAgent),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update agent');
      }
      
      setAgents(agents.map(a => a.id === agentId ? updatedAgent : a));
    } catch (err) {
      setError(err.message);
      console.error('Error toggling agent status:', err);
    }
  };

  // Delete an agent
  const deleteAgent = async (agentId) => {
    try {
      const response = await fetch(`${API_URL}/agents/${agentId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete agent');
      }
      
      setAgents(agents.filter(agent => agent.id !== agentId));
    } catch (err) {
      setError(err.message);
      console.error('Error deleting agent:', err);
    }
  };

  // Update an agent
  const updateAgent = async (updatedAgent) => {
    try {
      const response = await fetch(`${API_URL}/agents/${updatedAgent.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedAgent),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update agent');
      }
      
      setAgents(agents.map(agent => 
        agent.id === updatedAgent.id 
          ? updatedAgent 
          : agent
      ));
    } catch (err) {
      setError(err.message);
      console.error('Error updating agent:', err);
    }
  };

  // Value object that will be provided to consumers
  const value = {
    agents,
    loading,
    error,
    addAgent,
    toggleAgentStatus,
    deleteAgent,
    updateAgent
  };

  return (
    <AgentContext.Provider value={value}>
      {children}
    </AgentContext.Provider>
  );
};
