import React from 'react';
import { Box, CssBaseline, useTheme } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface SidePanelProps {
  children: React.ReactNode;
}

const SidePanel: React.FC<SidePanelProps> = ({ children }) => {
  const theme = useTheme();

  // Example probe value
  // take the username from cokies or localStorage
  // const probe = .getItem('username') || 'Guest';
  
  const probe = '';

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Navbar probe={probe} />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          backgroundColor: '#f0f2f5',
          minHeight: '100vh',
          paddingTop: '80px', // Space for AppBar
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

  // return (
  //   <Box sx={{ display: 'flex' }}>
  //     <CssBaseline />

  //     {/* Top AppBar */}
  //     <AppBar
  //       position="fixed"
  //       elevation={1}
  //       sx={{
  //         zIndex: (theme) => theme.zIndex.drawer + 1,
  //         backgroundColor: '#1a1a1a',
  //         color: '#fff',
  //       }}
  //     >
  //       <Toolbar>
  //         <IconButton
  //           edge="start"
  //           color="inherit"
  //           aria-label="menu"
  //           sx={{ mr: 2, display: { sm: 'none' } }}
  //         >
  //           <MenuIcon />
  //         </IconButton>
  //         <Typography variant="h6" noWrap fontWeight="bold">
  //           Admin Dashboard
  //         </Typography>
  //       </Toolbar>
  //     </AppBar>

  //     {/* Side Drawer */}
  //     <Drawer
  //       variant="permanent"
  //       sx={{
  //         width: drawerWidth,
  //         flexShrink: 0,
  //         [`& .MuiDrawer-paper`]: {
  //           width: drawerWidth,
  //           boxSizing: 'border-box',
  //           backgroundColor: '#f9f9f9',
  //           paddingTop: '64px',
  //           borderRight: `1px solid ${theme.palette.divider}`,
  //         },
  //       }}
  //     >
  //       <Box sx={{ p: 2 }}>
  //         <Typography variant="subtitle1" fontWeight={600} color="text.secondary" mb={1}>
  //           Admin Panel
  //         </Typography>
  //         <Divider />
  //       </Box>

  //       <List>
  //         {menuItems.map((item) => (
  //           <ListItem key={item.text} disablePadding>
  //             <ListItemButton
  //               component={Link}
  //               to={item.path}
  //               sx={{
  //                 '&:hover': {
  //                   backgroundColor: theme.palette.grey[200],
  //                 },
  //               }}
  //             >
  //               <ListItemIcon>{item.icon}</ListItemIcon>
  //               <ListItemText primary={item.text} />
  //             </ListItemButton>
  //           </ListItem>
  //         ))}
  //       </List>
  //     </Drawer>

  //     {/* Main Content */}
  //     <Box
  //       component="main"
  //       sx={{
  //         flexGrow: 1,
  //         p: 4,
  //         backgroundColor: '#f0f2f5',
  //         minHeight: '100vh',
  //         paddingTop: '80px', // Space for AppBar
  //       }}
  //     >
  //       {children}
  //     </Box>
  //   </Box>
  // );

export default SidePanel;
