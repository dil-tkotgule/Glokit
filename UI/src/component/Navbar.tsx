import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '../redux/store';
import { setUser } from '../redux/slice';
import { useNavigate } from 'react-router-dom';
import image from '../../public/profile image2.jpg'
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

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(
      setUser({
        name: '',
        email: '',
        role: '',
        is_verified: false,
      })
    );
    handleMenuClose();
  };

  const navigate = useNavigate();
  const handleForgotPassword = () => {
    navigate('resetPassword');
  }

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
          <Typography variant="h6" fontWeight="bold" noWrap
            sx={{ color: 'white', fontSize: '2rem' }}>
            GloKit
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body1" sx={{ color: '#fff' }}>
                {displayName}
              </Typography>
              <IconButton
                onClick={handleMenuOpen}
                color="inherit"
                sx={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: 'white',
                  borderColor:'white',
                  '&:hover': {
                    backgroundColor: 'rgba(188, 183, 183, 0.43)',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                  },
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  transition: 'all 0.3s ease',
                }}
              >
                <Avatar
                  src={image}
                  alt={user.name}
                >
                  {!image && user.name?.charAt(0).toUpperCase()}
                </Avatar>

              </IconButton>

              {/* User Menu */}
              <Menu
                anchorEl={anchorEl}
                open={isMenuOpen}
                onClose={handleMenuClose}
                MenuListProps={{
                  'aria-labelledby': 'user-menu-button',
                }}
              >
                <MenuItem onClick={handleMenuClose}>View Profile</MenuItem>
                <MenuItem onClick={handleForgotPassword}>Forgot Password</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </Box>
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
