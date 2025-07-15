import React from 'react';
import { Box, CssBaseline, useTheme } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface SidePanelProps {
  children: React.ReactNode;
}

const SidePannel: React.FC<SidePanelProps> = ({ children }) => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const isLoginPage = location.pathname === '/login';

  // Get username from localStorage or default to "Guest"
  let probe = localStorage.getItem('username') 

  const handleLoginClick = () => {
    navigate('/login');
  };

  // Example probe value
  // take the username from cokies or localStorage
  // const probe = .getItem('username') || 'Guest';
  
   probe = '';

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* Hide Navbar and Sidebar on login page */}
      {!isLoginPage && <Navbar probe={probe} onLoginClick={handleLoginClick} />}
      {!isLoginPage && <Sidebar />}

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          backgroundColor: '#f0f2f5',
          minHeight: '100vh',
          paddingTop: isLoginPage ? 0 : '80px', // Remove padding on login page
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default SidePannel;
