// Navbar.tsx
import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '../redux/store';
import { setUser } from '../redux/slice';

interface NavbarProps {
  probe?: string;
  onLoginClick?: () => void;
  onMenuClick?: () => void;
  isSmallScreen?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({
  probe,
  onLoginClick,
  onMenuClick,
  isSmallScreen,
}) => {
  const user = useSelector((state: RootState) => state);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(
      setUser({
        name: '',
        email: '',
        role: '',
        is_verified: false,
      })
    );
  };

  const isLoggedIn = !!user.email;
  const displayName = user.role === 'admin' ? 'Admin' : user.name || 'User';

  return (
    <AppBar
      position="fixed"
      elevation={1}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: '#1a1a1a',
        color: '#fff',
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Left Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isSmallScreen && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={onMenuClick}
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" fontWeight="bold" noWrap>
            {displayName}
          </Typography>
        </Box>

        {/* Right Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {probe && (
            <Typography variant="subtitle1" sx={{ color: '#fff' }}>
              {probe}
            </Typography>
          )}
          {isLoggedIn ? (
            <Button
              variant="outlined"
              color="inherit"
              onClick={handleLogout}
              sx={{
                borderColor: '#fff',
                color: '#fff',
                textTransform: 'none',
                '&:hover': { borderColor: '#ccc' },
              }}
            >
              Logout
            </Button>
          ) : (
            <Button
              variant="outlined"
              color="inherit"
              onClick={onLoginClick}
              sx={{
                borderColor: '#fff',
                color: '#fff',
                textTransform: 'none',
                '&:hover': { borderColor: '#ccc' },
              }}
            >
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
