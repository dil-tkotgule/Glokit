import React from "react";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

interface NavbarProps {
  probe?: string;
}

const Navbar: React.FC<NavbarProps> = ({ probe }) => (
  <AppBar
    position="fixed"
    elevation={1}
    sx={{
      zIndex: (theme) => theme.zIndex.drawer + 1,
      backgroundColor: "#1a1a1a",
      color: "#fff",
      
    }}
  >
    <Toolbar
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
      
      <Typography variant="h6" noWrap fontWeight="bold">
        Admin
      </Typography>
      <Typography
        variant="subtitle1"
        sx={{ ml: 2, color: "#fff", justifySelf: "end" }}
      >
        {probe}
      </Typography>
    </Toolbar>
  </AppBar>
);

export default Navbar;  