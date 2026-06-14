const express = require('express');
const router = express.Router();
const { getUserNotifications, markAsRead, getEventNotifications } = require('../controllers/notificationController');
const authMiddleware = require('../middleware/auth');

router.get('/user', authMiddleware, getUserNotifications);
router.patch('/mark-as-read/:id', authMiddleware, markAsRead);
router.get('/event/:eventId', authMiddleware, getEventNotifications);

module.exports = router;