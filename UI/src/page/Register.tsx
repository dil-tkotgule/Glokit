import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Avatar
} from '@mui/material';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/slice';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; general?: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!form.name) newErrors.name = 'Name is required';
    if (!form.email) newErrors.email = 'Email is required';
    if (!form.password) newErrors.password = 'Password is required';
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
      const response = await fetch('http://localhost:3000/app/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();
      const user = data.data.user;

const userPayload = {
    name: user.name,
    email: user.email,
    role: user.role,
    is_verified: user.is_verified
};

localStorage.setItem("user", JSON.stringify(userPayload));
dispatch(setUser(userPayload));


      console.log('Registration successful:', user);
      navigate('/login'); // redirect after registration
    } catch (err: any) {
      setErrors({ general: err.message || 'Server error' });
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #000 0%, #ff9800 100%)',
      }}
    >
      <Paper
        elevation={8}
        sx={{
          padding: 3,
          minWidth: 300,
          maxWidth: 340,
          borderRadius: 3,
          boxShadow: '0 4px 24px 0 rgba(0,0,0,0.25)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: '#fff',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: '#ff9800', width: 44, height: 44 }}>
          <PersonAddAltIcon fontSize="medium" sx={{ color: '#fff' }} />
        </Avatar>
        <Typography
          variant="h5"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 700, color: '#000', letterSpacing: 1, mb: 1 }}
        >
          Register
        </Typography>

        <form onSubmit={handleSubmit} noValidate style={{ width: '100%' }}>
          <TextField
            label="Name"
            name="name"
            fullWidth
            margin="dense"
            value={form.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            required
            sx={textFieldStyles}
            InputLabelProps={{ style: { color: '#ff9800' } }}
          />

          <TextField
            label="Email"
            name="email"
            fullWidth
            margin="dense"
            value={form.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            required
            sx={textFieldStyles}
            InputLabelProps={{ style: { color: '#ff9800' } }}
          />

          <TextField
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            margin="dense"
            value={form.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            required
            sx={{ ...textFieldStyles, mt: 1 }}
            InputLabelProps={{ style: { color: '#ff9800' } }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                    size="small"
                    sx={{ color: '#ff9800' }}
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
              fontSize: '1rem',
              borderRadius: 2,
              background: '#ff9800',
              color: '#fff',
              '&:hover': {
                background: '#000',
                color: '#ff9800',
              },
              boxShadow: '0 2px 8px rgba(255,152,0,0.10)',
            }}
          >
            Register
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

const textFieldStyles = {
  borderRadius: 1,
  background: '#fafafa',
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: '#ff9800' },
    '&:hover fieldset': { borderColor: '#000' },
    '&.Mui-focused fieldset': { borderColor: '#000' }
  }
};

export default Register;
