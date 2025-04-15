import express from 'express';
import { getNearbyLawyers } from '../controllers/legalAid.controller.js';
import verifyToken from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/nearby', verifyToken, getNearbyLawyers);

export default router;
