const express = require('express');
const router = express.Router();
const { getUserRegistrations, registerForEvent, cancelRegistration } = require('../controllers/registrationController');
const authMiddleware = require('../middleware/auth');

router.post('/:eventId', authMiddleware, registerForEvent);
router.get('/', authMiddleware, getUserRegistrations);
router.delete('/:id', authMiddleware, cancelRegistration);

module.exports = router;