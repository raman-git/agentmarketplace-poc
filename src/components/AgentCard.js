import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  Avatar,
  Switch,
  FormControlLabel,
} from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';

const AgentCard = ({ agent, onToggleStatus }) => {
  const { id, name, description, category, capabilities, isEnabled, imageUrl } = agent;

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
        }
      }}
    >
      <Box 
        sx={{ 
          p: 2, 
          display: 'flex', 
          alignItems: 'center',
          backgroundColor: isEnabled ? 'rgb(20, 100, 100)' : 'grey.300',
          color: isEnabled ? 'white' : 'text.secondary'
        }}
      >
        <Avatar 
          src={imageUrl} 
          sx={{ mr: 2 }}
          alt={name}
        >
          <SmartToyIcon />
        </Avatar>
        <Typography variant="h6" component="div">
          {name}
        </Typography>
      </Box>
      
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>
        
        <Box sx={{ mb: 1 }}>
          <Chip 
            label={category} 
            size="small" 
            color="primary" 
            variant="outlined" 
            sx={{ mr: 1 }} 
          />
        </Box>
        
        <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
          Capabilities:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {capabilities.map((capability, index) => (
            <Chip 
              key={index} 
              label={capability} 
              size="small" 
              variant="outlined" 
              sx={{ mb: 0.5 }} 
            />
          ))}
        </Box>
      </CardContent>
      
      <CardActions sx={{ justifyContent: 'space-between', p: 2, pt: 0 }}>
        <FormControlLabel
          control={
            <Switch 
              checked={isEnabled} 
              onChange={() => onToggleStatus(id)} 
              color="primary"
            />
          }
          label={isEnabled ? "Enabled" : "Disabled"}
        />
        <Button 
          size="small" 
          color="primary"
          component={RouterLink}
          to={`/edit/${id}`}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default AgentCard;
