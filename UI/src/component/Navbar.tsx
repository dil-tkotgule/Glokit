import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { type RootState } from "../redux/store";
import { setUser } from "../redux/slice"; // for logging out

interface NavbarProps {
  probe?: string;
  onLoginClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ probe, onLoginClick }) => {
  const user = useSelector((state: RootState) => state); // whole user slice
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(
      setUser({
        name: "",
        email: "",
        role: "",
        is_verified: false,
      })
    );
  };

  const isLoggedIn = !!user.email;

  // Show "Admin" if role is admin, else show user's name
  const displayName = user.role === "admin" ? "Admin" : user.name || "User";

  return (
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
        {/* Left: Name or Admin */}
        <Typography variant="h6" noWrap fontWeight="bold">
          {displayName}
        </Typography>

        {/* Right: Probe info and Auth Button */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {probe && (
            <Typography variant="subtitle1" sx={{ color: "#fff" }}>
              {probe}
            </Typography>
          )}

          {isLoggedIn ? (
            <Button
              variant="outlined"
              color="inherit"
              onClick={handleLogout}
              sx={{
                borderColor: "#fff",
                color: "#fff",
                textTransform: "none",
                "&:hover": {
                  borderColor: "#ccc",
                },
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
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
