const express = require('express');
const router = express.Router();
const { createEvent, getEvents, getEvent, updateEvent, deleteEvent } = require('../controllers/eventController');
const authMiddleware = require('../middleware/auth');
const { validateEvent, validateParamId } = require('../middleware/validation');

router.post('/', authMiddleware, authMiddleware.authorize('organizer', 'admin'), validateEvent, createEvent);
router.get('/', getEvents);
router.get('/:id', validateParamId('id'), getEvent);
router.put('/:id', authMiddleware, validateParamId('id'), validateEvent, updateEvent);
router.delete('/:id', authMiddleware, validateParamId('id'), deleteEvent);

module.exports = router;