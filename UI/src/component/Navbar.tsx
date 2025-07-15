import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from "@mui/material";

interface NavbarProps {
  probe?: string;
  onLoginClick?: () => void; // Optional click handler for Login
}

const Navbar: React.FC<NavbarProps> = ({ probe, onLoginClick }) => (
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
      }}
    >
      {/* Left: Logo/Title */}
      <Typography variant="h6" noWrap fontWeight="bold">
        Admin
      </Typography>

      {/* Right: Probe info and Login */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {probe && (
          <Typography variant="subtitle1" sx={{ color: "#fff" }}>
            {probe}
          </Typography>
        )}

        <Button
          variant="outlined"
          color="inherit"
          onClick={onLoginClick}
          sx={{
            borderColor: "#fff",
            color: "#fff",
            textTransform: "none",
            "&:hover": {
              borderColor: "#ccc",
            },
          }}
        >
          Login
        </Button>
      </Box>
    </Toolbar>
  </AppBar>
);

export default Navbar;
