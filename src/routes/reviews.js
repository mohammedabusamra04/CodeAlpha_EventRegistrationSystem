const express = require('express');
const router = express.Router();
const { createReview, getEventReviews, deleteReview } = require('../controllers/reviewController');
const authMiddleware = require('../middleware/auth');

router.post('/:eventId', authMiddleware, createReview);
router.get('/:eventId', getEventReviews);
router.delete('/:id', authMiddleware, deleteReview);

module.exports = router;