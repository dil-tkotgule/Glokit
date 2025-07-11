import express from 'express';
import UserController from '../controller/UserController';

const router = express.Router();

router.post('/login', UserController.login);

router.get('/logout', UserController.logout);

router.post('/register', UserController.register);

export default router;