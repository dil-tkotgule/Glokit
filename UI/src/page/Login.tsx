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
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {type RootState, type  AppDispatch} from '../redux/store'
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/slice';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate= useNavigate();
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<{ userId?: string; password?: string; general?: string }>({});
const dispatch=useDispatch();
    const validate = () => {
        const newErrors: typeof errors = {};
        if (!userId) newErrors.userId = 'User ID is required';
        if (!password) newErrors.password = 'Password is required';
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
        const response = await fetch('http://localhost:3000/app/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
             credentials: 'include',
            body: JSON.stringify({
                email: userId,
                password: password
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Login failed');
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


        console.log('Login successful:', data.data);

        navigate('/'); // ✅ redirect after login

    } catch (err: any) {
        setErrors({ general: err.message || 'Invalid credentials or server error.' });
    }
};



    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #000 0%, #ff9800 100%)'
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
                    background: '#fff'
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: '#ff9800', width: 44, height: 44 }}>
                    <LockOutlinedIcon fontSize="medium" sx={{ color: '#fff' }} />
                </Avatar>
                <Typography
                    variant="h5"
                    component="h1"
                    gutterBottom
                    sx={{
                        fontWeight: 700,
                        color: '#000',
                        letterSpacing: 1,
                        mb: 1
                    }}
                >
                    Login
                </Typography>
                <form onSubmit={handleSubmit} noValidate style={{ width: '100%' }}>
                    <TextField
                        label="User ID"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        value={userId}
                        onChange={e => setUserId(e.target.value)}
                        error={!!errors.userId}
                        helperText={errors.userId}
                        autoComplete="username"
                        required
                        sx={{
                            borderRadius: 1,
                            background: '#fafafa',
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: '#ff9800' },
                                '&:hover fieldset': { borderColor: '#000' },
                                '&.Mui-focused fieldset': { borderColor: '#000' }
                            }
                        }}
                        InputLabelProps={{ style: { color: '#ff9800' } }}
                    />
                    <TextField
                        label="Password"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        error={!!errors.password}
                        helperText={errors.password}
                        autoComplete="current-password"
                        required
                        sx={{
                            borderRadius: 1,
                            background: '#fafafa',
                            mt: 1,
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: '#ff9800' },
                                '&:hover fieldset': { borderColor: '#000' },
                                '&.Mui-focused fieldset': { borderColor: '#000' }
                            }
                        }}
                        InputLabelProps={{ style: { color: '#ff9800' } }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowPassword((show) => !show)}
                                        edge="end"
                                        size="small"
                                        sx={{ color: '#ff9800' }}
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            )
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
                                color: '#ff9800'
                            },
                            boxShadow: '0 2px 8px rgba(255,152,0,0.10)'
                        }}
                    >
                        Login
                    </Button>
                </form>
            </Paper>
        </Box>
    );
};

export default Login;
