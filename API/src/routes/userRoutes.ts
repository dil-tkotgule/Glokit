import express from 'express';
import UserController from '../controller/UserController';

const router = express.Router();

router.post('/login', UserController.login);

router.get('/logout', UserController.logout);

router.post('/register', UserController.register);

router.post('/change-password/:email', UserController.changePassword);


// user change password route
// endpoint to change user password
// POST /app/user/change-password/user@example.com
// Content-Type: application/json

// {
//   "currentPassword": "myOldPassword",
//   "newPassword": "myNewPassword123",
//   "confirmPassword": "myNewPassword123"
// }
export default router;