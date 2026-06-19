const express = require('express');
const router = express.Router();
const { getUserNotifications, markAsRead, getEventNotifications } = require('../controllers/notificationController');
const authMiddleware = require('../middleware/auth');
const { validateParamId } = require('../middleware/validation');

router.get('/user', authMiddleware, getUserNotifications);
router.patch('/mark-as-read/:id', authMiddleware, validateParamId('id'), markAsRead);
router.get('/event/:eventId', authMiddleware, validateParamId('eventId'), getEventNotifications);

module.exports = router;