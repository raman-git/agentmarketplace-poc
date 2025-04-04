import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Components
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import RegisterAgentPage from './pages/RegisterAgentPage';

// Context
import { AgentProvider } from './context/AgentContext';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1773b0',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 500,
    },
    h2: {
      fontWeight: 500,
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AgentProvider>
        <Router>
          <div className="App">
            <Header />
            <main style={{ minHeight: 'calc(100vh - 130px)', padding: '20px' }}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/register" element={<RegisterAgentPage />} />
                <Route path="/edit/:id" element={<RegisterAgentPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AgentProvider>
    </ThemeProvider>
  );
}

export default App;
