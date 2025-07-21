import React, { useState } from 'react';
import { Box, CssBaseline, useTheme, useMediaQuery } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { type RootState } from '../redux/store'; // adjust path
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface SidePannelProps {
  children: React.ReactNode;
}
const SidePannel: React.FC<SidePannelProps> = ({ children }) => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [mobileOpen, setMobileOpen] = useState(false);
  const isLoginPage = location.pathname === '/login';

  const user = useSelector((state: RootState) => state);
  const role = user?.role || JSON.parse(localStorage.getItem('user') || '{}')?.role || '';
  let probe = localStorage.getItem('userm') || '';

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {!isLoginPage && (
        <Navbar
          probe={probe}
          onLoginClick={() => navigate('/login')}
          onMenuClick={handleDrawerToggle}
          isSmallScreen={isSmallScreen}
        />
      )}

      {!isLoginPage && (
        role === 'fresher' ? (
          <></>
        ) : (
          <Sidebar
            variant={isSmallScreen ? 'temporary' : 'permanent'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
          />
        )
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          backgroundColor: '#f0f2f5',
          minHeight: '100vh',
          paddingTop: isLoginPage ? 0 : '80px',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default SidePannel;
