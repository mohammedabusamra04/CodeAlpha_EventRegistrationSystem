const express = require('express');
const router = express.Router();
const { getUserRegistrations, registerForEvent, cancelRegistration } = require('../controllers/registrationController');
const authMiddleware = require('../middleware/auth');
const { validateParamId } = require('../middleware/validation');

router.post('/:eventId', authMiddleware, validateParamId('eventId'), registerForEvent);
router.get('/', authMiddleware, getUserRegistrations);
router.delete('/:id', authMiddleware, validateParamId('id'), cancelRegistration);

module.exports = router;