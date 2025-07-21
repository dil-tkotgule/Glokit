import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    Snackbar,
    Alert,
    Avatar
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { setUser } from '../redux/slice';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '../redux/store';

const ForgotPassword: React.FC = () => {
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state);
    const dispatch = useDispatch();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [errors, setErrors] = useState<{ currentPassword?: string; newPassword?: string; confirmNewPassword?: string; general?: string }>({});
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const validate = () => {
        const newErrors: typeof errors = {};

        if (!currentPassword) newErrors.currentPassword = 'Current password is required';
        if (!newPassword) newErrors.newPassword = 'New password is required';
        if (newPassword !== confirmNewPassword) newErrors.confirmNewPassword = 'Passwords do not match';
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
            const response = await fetch('http://localhost:3000/app/user/resetPassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to change password');
            }

            setSnackbarMessage('Password changed successfully');
            setSnackbarOpen(true);

            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');

            //redirect after some delay
            setTimeout(() => {
                navigate('/');
            }, 2000);

        } catch (err: any) {
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
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
                    Forgot Password
                </Typography>
                <form onSubmit={handleSubmit} noValidate style={{ width: '100%' }}>
                    <TextField
                        label="Current Password"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        type="password" // Always hide the current password
                        value={currentPassword}
                        onChange={e => setCurrentPassword(e.target.value)}
                        error={!!errors.currentPassword}
                        helperText={errors.currentPassword}
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
                        label="New Password"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        type="password"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        error={!!errors.newPassword}
                        helperText={errors.newPassword}
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
                    />
                    <TextField
                        label="Confirm New Password"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        type="password"
                        value={confirmNewPassword}
                        onChange={e => setConfirmNewPassword(e.target.value)}
                        error={!!errors.confirmNewPassword}
                        helperText={errors.confirmNewPassword}
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
                        Change Password
                    </Button>
                </form>
            </Paper>

            {/* Snackbar for success message */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ForgotPassword;
