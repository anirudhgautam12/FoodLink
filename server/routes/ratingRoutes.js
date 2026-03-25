import express from 'express';
import { addRating } from '../controllers/ratingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, addRating);

export default router;
