import express from 'express';
import { addFood, getNearbyFood, claimFood, getDonorListings } from '../controllers/foodController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, addFood);
router.get('/nearby', protect, getNearbyFood);
router.get('/donor', protect, getDonorListings);
router.put('/:id/claim', protect, claimFood);

export default router;
