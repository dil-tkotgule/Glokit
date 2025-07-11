import React from 'react';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

interface NavbarProps {
  probe?: string;
}

const Navbar: React.FC<NavbarProps> = ({ probe }) => (
  <AppBar
    position="fixed"
    elevation={1}
    sx={{
      zIndex: (theme) => theme.zIndex.drawer + 1,
      backgroundColor: '#1a1a1a',
      color: '#fff',
    }}
  >
    <Toolbar>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        sx={{ mr: 2, display: { sm: 'none' } }}
      >
        <MenuIcon />
      </IconButton>
      <Typography variant="h6" noWrap fontWeight="bold">
        Admin {
            probe &&
            <span >{probe}</span>
        }
      </Typography>
     
    </Toolbar>
  </AppBar>
);

export default Navbar;
// // Common text styles
// const navTextStyle = {
//   fontFamily: 'Roboto, sans-serif',
//   fontWeight: 500,
//   fontSize: '1rem',
//   textTransform: 'none',
// };

// const menuTextStyle = {
//   fontFamily: 'Roboto, sans-serif',
//   fontWeight: 500,
//   fontSize: '1rem',
//   textAlign: 'center',
//   color: 'inherit',
//   textDecoration: 'none',
//   display: 'block',
//   width: '100%',
// };

// function ResponsiveAppBar() {
//   const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
//   const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

//   const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
//     setAnchorElNav(event.currentTarget);
//   };

//   const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
//     setAnchorElUser(event.currentTarget);
//   };

//   const handleCloseNavMenu = () => {
//     setAnchorElNav(null);
//   };

//   const handleCloseUserMenu = () => {
//     setAnchorElUser(null);
//   };

//   return (
  
//   );
// }

// export default ResponsiveAppBar;
