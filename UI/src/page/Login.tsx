import React, { useState } from "react";
import { Bounce, ToastContainer, toast } from "react-toastify";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Avatar,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const Login: React.FC = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    userId?: string;
    password?: string;
    general?: string;
  }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!userId) newErrors.userId = "User ID is required";
    if (!password) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    try {
      // Api call to login

      const response = await axios.post(
        "http://localhost:3000/app/user/login",
        {
          email:userId,
          password,
        }
      );
        console.log(response);
      if ( response.status === 200) {
        // save response.data into cookies 
        document.cookie = `userinfo=${response.data}; path=/; max-age=3600`; // Example cookie setting
        // Handle successful login, e.g., redirect or update app state
        console.log("Login successful");
        // Redirect to dashboard or home page
        toast.success("Login Successful", {
          position: "top-center",
          autoClose: 500,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
          onClose : () => {
            console.log("Toast clicked");
            // Redirect to listing page 
            window.location.href = '/'; // Example redirect
          },
        });

        // window.location.href = '/dashboard'; // Example redirect
      }
      else{
        console.error("Login failed");
        console.log(response);
        toast.error("Login failed", {
          position: "top-center",
          autoClose: 500,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      }

      // Replace with actual API call
      // await loginApi({ userId, password });
      // On success, redirect or update app state
    } catch (err) {
    //   setErrors({ general: "Invalid credentials or server error." });
    console.log(err);

    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #000 0%, #ff9800 100%)",
      }}
    >
      <Paper
        elevation={8}
        sx={{
          padding: 3,
          minWidth: 300,
          maxWidth: 340,
          borderRadius: 3,
          boxShadow: "0 4px 24px 0 rgba(0,0,0,0.25)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background: "#fff",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "#ff9800", width: 44, height: 44 }}>
          <LockOutlinedIcon fontSize="medium" sx={{ color: "#fff" }} />
        </Avatar>
        <Typography
          variant="h5"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: "#000",
            letterSpacing: 1,
            mb: 1,
          }}
        >
          Login
        </Typography>
        <form onSubmit={handleSubmit} noValidate style={{ width: "100%" }}>
          <TextField
            label="User ID"
            variant="outlined"
            fullWidth
            margin="dense"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            error={!!errors.userId}
            helperText={errors.userId}
            autoComplete="username"
            required
            sx={{
              borderRadius: 1,
              background: "#fafafa",
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#ff9800" },
                "&:hover fieldset": { borderColor: "#000" },
                "&.Mui-focused fieldset": { borderColor: "#000" },
              },
            }}
            InputLabelProps={{ style: { color: "#ff9800" } }}
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            margin="dense"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
            autoComplete="current-password"
            required
            sx={{
              borderRadius: 1,
              background: "#fafafa",
              mt: 1,
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#ff9800" },
                "&:hover fieldset": { borderColor: "#000" },
                "&.Mui-focused fieldset": { borderColor: "#000" },
              },
            }}
            InputLabelProps={{ style: { color: "#ff9800" } }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword((show) => !show)}
                    edge="end"
                    size="small"
                    sx={{ color: "#ff9800" }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {errors.general && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {errors.general}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              py: 1,
              fontWeight: 600,
              fontSize: "1rem",
              borderRadius: 2,
              background: "#ff9800",
              color: "#fff",
              "&:hover": {
                background: "#000",
                color: "#ff9800",
              },
              boxShadow: "0 2px 8px rgba(255,152,0,0.10)",
            }}
          >
            Login
          </Button>
        </form>
      </Paper>
      <ToastContainer></ToastContainer>
    </Box>
  );
};

export default Login;
