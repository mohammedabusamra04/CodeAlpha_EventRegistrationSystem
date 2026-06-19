const { Event, Category, User, Registration } = require('../models');
const { createNotification } = require('./notificationController');

const createEvent = async (req, res) => {
    const { title, description, thumbnail, location, address, startDate, endDate, capacity, price, categoryId } = req.body;
    try {
        const category = await Category.findByPk(categoryId);
        if (!category) {
            return res.status(400).json({ message: 'Invalid Category ID' });
        }

        const event = await Event.create({
            title,
            description,
            thumbnail,
            location,
            address,
            startDate,
            endDate,
            capacity,
            availableSeats: capacity,
            price: price || 0,
            categoryId,
            organizerId: req.user.id,
        });
        res.status(201).json(event);
    } catch (err) {
        console.error('Create Event Error:', err);
        res.status(500).json({ message: 'Internal server error occurred' });
    }
};

const getEvents = async (req, res) => {
    try {
        const events = await Event.findAll({
            include: [
                { model: Category, as: 'category', attributes: ['name'] },
                { model: User, as: 'organizer', attributes: ['name'] },
            ],
            order: [['startDate', 'ASC']]
        });
        res.json(events);
    } catch (err) {
        console.error('Get Events Error:', err);
        res.status(500).json({ message: 'Internal server error occurred' });
    }
};

const getEvent = async (req, res) => {
    const { id } = req.params;
    try {
        const event = await Event.findByPk(id, {
            include: [
                { model: Category, as: 'category', attributes: ['name'] },
                { model: User, as: 'organizer', attributes: ['name'] },
            ],
        });
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json(event);
    } catch (err) {
        console.error('Get Event Error:', err);
        res.status(500).json({ message: 'Internal server error occurred' });
    }
};

const updateEvent = async (req, res) => {
    const { id } = req.params;
    const { title, description, thumbnail, location, address, startDate, endDate, capacity, price, categoryId } = req.body;
    try {
        const event = await Event.findByPk(id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        if (event.organizerId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You are not authorized to update this event' });
        }

        if (categoryId) {
            const category = await Category.findByPk(categoryId);
            if (!category) {
                return res.status(400).json({ message: 'Invalid Category ID' });
            }
        }

        let newAvailableSeats = event.availableSeats;
        if (capacity !== undefined) {
            const diff = capacity - event.capacity;
            newAvailableSeats = event.availableSeats + diff;
            if (newAvailableSeats < 0) {
                return res.status(400).json({ message: 'Cannot reduce capacity below currently registered seats count' });
            }
        }

        await event.update({
            title: title || event.title,
            description: description || event.description,
            thumbnail: thumbnail || event.thumbnail,
            location: location || event.location,
            address: address || event.address,
            startDate: startDate || event.startDate,
            endDate: endDate || event.endDate,
            capacity: capacity !== undefined ? capacity : event.capacity,
            availableSeats: newAvailableSeats,
            price: price !== undefined ? price : event.price,
            categoryId: categoryId || event.categoryId,
        });

        // If critical details are updated, notify registered users
        if (title || location || address || startDate || endDate) {
            const registrations = await Registration.findAll({ where: { eventId: id } });
            for (const reg of registrations) {
                await createNotification(
                    reg.userId,
                    id,
                    'Event Details Updated',
                    `The details for event "${event.title}" have been updated. Please review the updated page for details.`,
                    'reminder'
                ).catch(err => console.error('Failed to create notification for updateEvent:', err));
            }
        }

        res.json(event);
    } catch (err) {
        console.error('Update Event Error:', err);
        res.status(500).json({ message: 'Internal server error occurred' });
    }
};

const deleteEvent = async (req, res) => {
    const { id } = req.params;
    try {
        const event = await Event.findByPk(id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        if (event.organizerId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You are not authorized to delete this event' });
        }
        await event.destroy();
        res.json({ message: 'Event deleted successfully' });
    } catch (err) {
        console.error('Delete Event Error:', err);
        res.status(500).json({ message: 'Internal server error occurred' });
    }
};

module.exports = {
    createEvent,
    getEvents,
    getEvent,
    updateEvent,
    deleteEvent,
};