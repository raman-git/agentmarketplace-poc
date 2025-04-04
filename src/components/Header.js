import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
} from '@mui/material';

const Header = () => {
  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar>
          <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
            <img 
              src="/logo1.png" 
              alt="Agent Marketplace Logo" 
              style={{ height: '5em', marginRight: '4px' }}
            />
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{
                textDecoration: 'none',
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              Agent Marketplace
            </Typography>
          </Box>
          <Button
            color="inherit"
            component={RouterLink}
            to="/register"
            sx={{ ml: 2 }}
          >
            Register Agent
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
