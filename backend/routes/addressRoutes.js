import express from 'express';
import verifyToken from '../middlewares/auth.middleware.js';
import { saveUserAddress } from '../controllers/addressController.js';

const router = express.Router();

router.post('/user', verifyToken, saveUserAddress);

export default router;
