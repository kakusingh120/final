// lawyerRoutes.js - auto-generated
import express from 'express';
import { saveLawyerAddress } from '../controllers/lawyerAddressController.js';
import verifyToken from '../middlewares/auth.middleware.js';

const router = express.Router();

// Route to save lawyer's address - protected route (only lawyers can access)
router.post('/save', verifyToken, saveLawyerAddress);

export default router;
