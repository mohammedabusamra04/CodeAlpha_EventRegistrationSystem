const { User, Registration, Event } = require('../models');
const { createNotification } = require('./notificationController');

const registerForEvent = async (req, res) => {
    const { eventId } = req.params;
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const event = await Event.findByPk(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        if (event.availableSeats <= 0) {
            return res.status(400).json({ message: 'No available seats for this event' });
        }

        const existingRegistration = await Registration.findOne({
            where: { userId: user.id, eventId }
        });
        if (existingRegistration) {
            return res.status(400).json({ message: 'You are already registered for this event' });
        }

        const ticketCode = `TICKET-${Date.now()}-${req.user.id}`;

        const registration = await Registration.create({
            userId: user.id,
            eventId,
            ticketCode,
        });

        await event.update({ availableSeats: event.availableSeats - 1 });

        // Create user notification
        await createNotification(
            user.id,
            eventId,
            'Registration Confirmed',
            `You have successfully registered for the event: ${event.title}. Your ticket code is ${ticketCode}.`,
            'registration'
        );

        res.status(201).json(registration);
    } catch (err) {
        console.error('Register for Event Error:', err);
        res.status(500).json({ message: 'Internal server error occurred' });
    }
};

const getUserRegistrations = async (req, res) => {
    try {
        const registrations = await Registration.findAll({
            where: { userId: req.user.id },
            include: [{ model: Event, as: 'Event', attributes: ['title', 'description', 'startDate', 'endDate'] }],
        });
        res.json(registrations);
    } catch (err) {
        console.error('Get User Registrations Error:', err);
        res.status(500).json({ message: 'Internal server error occurred' });
    }
};

const cancelRegistration = async (req, res) => {
    const { id } = req.params;
    try {
        const registration = await Registration.findByPk(id);
        if (!registration) {
            return res.status(404).json({ message: 'Registration not found' });
        }
        if (registration.userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const event = await Event.findByPk(registration.eventId);
        if (event) {
            await event.update({ availableSeats: event.availableSeats + 1 });
            
            // Create user notification
            await createNotification(
                registration.userId,
                registration.eventId,
                'Registration Cancelled',
                `Your registration for the event: ${event.title} has been cancelled.`,
                'cancellation'
            );
        }

        await registration.destroy();
        res.json({ message: 'Registration cancelled successfully' });
    } catch (err) {
        console.error('Cancel Registration Error:', err);
        res.status(500).json({ message: 'Internal server error occurred' });
    }
};

module.exports = {
    registerForEvent,
    getUserRegistrations,
    cancelRegistration,
};