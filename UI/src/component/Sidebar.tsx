import React from 'react';
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { NavLink } from 'react-router-dom';

const drawerWidth = 200;

interface SidebarProps {
  variant: 'permanent' | 'temporary';
  open: boolean;
  onClose?: () => void;
}

const menuItems = [
  { text: 'Product List', icon: <DashboardIcon />, path: '/' },
];

const Sidebar: React.FC<SidebarProps> = ({ variant, open, onClose }) => {
  const theme = useTheme();

  return (
    <Drawer
      variant={variant}
      open={variant === 'temporary' ? open : true}
      onClose={onClose}
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#f9f9f9',
          paddingTop: '64px',
          borderRight: `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Divider />
      </Box>
      <List>
        {menuItems.map((item) => (
          <NavLink
            key={item.text}
            to={item.path}
            style={({ isActive }) => ({
              textDecoration: 'none',
              color: 'inherit',
              backgroundColor: isActive ? '#e0e0e0' : 'transparent',
              borderRadius: '4px',
              display: 'block',
            })}
          >
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          </NavLink>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
