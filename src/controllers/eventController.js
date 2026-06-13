const { Event, Category, User, Registration } = require('../models');

const createEvent = async (req, res) => {
    const { title, description, thumbnail, location, address, startDate, endDate, capacity, price, categoryId } = req.body;
    try {
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
            price,
            categoryId,
            organizerId: req.user.id,
        });
        res.status(201).json(event);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getEvents = async (req, res) => {
    try {
        const events = await Event.findAll({
            include: [
                { model: Category, as: 'category', attributes: ['name'] },
                { model: User, as: 'organizer', attributes: ['name'] },
            ],
        });
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: err.message });
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
        res.status(500).json({ message: err.message });
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
        if (event.organizerId !== req.user.id) {
            return res.status(403).json({ message: 'You are not authorized to update this event' });
        }
        await event.update({
            title,
            description,
            thumbnail,
            location,
            address,
            startDate,
            endDate,
            capacity,
            availableSeats: capacity - (event.capacity - event.availableSeats),
            price,
            categoryId,
        });
        res.json(event);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deleteEvent = async (req, res) => {
    const { id } = req.params;
    try {
        const event = await Event.findByPk(id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        if (event.organizerId !== req.user.id) {
            return res.status(403).json({ message: 'You are not authorized to delete this event' });
        }
        await event.destroy();
        res.json({ message: 'Event deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    createEvent,
    getEvents,
    getEvent,
    updateEvent,
    deleteEvent,
};