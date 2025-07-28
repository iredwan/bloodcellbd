import express from 'express';
import { protect } from '../middleware/auth.js';
import { 
  createReview,
  getReviews,
  getReviewById,
  updateReview,
  deleteReview,
  updateReviewStatus,
  getApprovedReviews,
  getReviewsByUserId,
  getReviewsForPublic
} from '../controllers/ReviewsController.js';

const router = express.Router();

// Create a new review
router.post('/create', protect, createReview);

// Get all reviews
router.get('/all', protect, getReviews);

// Get all reviews for public
router.get('/public', getReviewsForPublic);

// Get a single review by ID
router.get('/get/:id', getReviewById);

// Get reviews by user id
router.get('/user-id', protect, getReviewsByUserId);

// Get approved reviews
router.get('/approved', getApprovedReviews);

// Update a review
router.put('/update/:id', protect, updateReview);

// Update review status
router.put('/status/:id', protect, updateReviewStatus);

// Delete a review
router.delete('/delete/:id', protect, deleteReview);

export default router; 