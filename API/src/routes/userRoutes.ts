import express from 'express';
import UserController from '../controller/UserController';

const router = express.Router();

router.post('/login', UserController.login);

router.get('/logout', UserController.logout);

router.post('/register', UserController.register);

router.post('/change-password/:userId', UserController.changePassword);


// user change password route
// endpoint to change user password
// POST /app/user/change-password/1
// Content-Type: application/json

// {
//   "currentPassword": "myOldPassword",
//   "newPassword": "myNewPassword123",
//   "confirmPassword": "differentPassword"



// }
export default router;