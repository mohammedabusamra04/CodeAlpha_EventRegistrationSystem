const { User, Registration, Event } = require('../models');

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
        if (event.availableSeats === 0) {
            return res.status(400).json({ message: 'No available seats' });
        }

        const ticketCode = `TICKET-${Date.now()}-${req.user.id}`;

        const registration = await Registration.create({
            userId: user.id,
            eventId,
            ticketCode,
        });

        await event.update({ availableSeats: event.availableSeats - 1 });

        res.status(201).json(registration);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getUserRegistrations = async (req, res) => {
    try {
        const registrations = await Registration.findAll({
            where: { userId: req.user.id },
            include: [{ model: Event, as: 'event', attributes: ['title', 'description', 'startDate', 'endDate'] }],
        });
        res.json(registrations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const cancelRegistration = async (req, res) => {
    const { id } = req.params;
    try {
        const registration = await Registration.findByPk(id);
        if (!registration) {
            return res.status(404).json({ message: 'Registration not found' });
        }
        if (registration.userId !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const event = await Event.findByPk(registration.eventId);
        if (event) {
            await event.update({ availableSeats: event.availableSeats + 1 });
        }

        await registration.destroy();
        res.json({ message: 'Registration cancelled' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    registerForEvent,
    getUserRegistrations,
    cancelRegistration,
};