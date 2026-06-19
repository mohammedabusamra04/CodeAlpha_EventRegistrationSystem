const express = require('express');
const router = express.Router();
const { createReview, getEventReviews, deleteReview } = require('../controllers/reviewController');
const authMiddleware = require('../middleware/auth');
const { validateReview, validateParamId } = require('../middleware/validation');

router.post('/:eventId', authMiddleware, validateParamId('eventId'), validateReview, createReview);
router.get('/:eventId', validateParamId('eventId'), getEventReviews);
router.delete('/:id', authMiddleware, validateParamId('id'), deleteReview);

module.exports = router;