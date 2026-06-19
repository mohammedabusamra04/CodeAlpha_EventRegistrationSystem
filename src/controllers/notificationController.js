const { Notification, Event } = require('../models');

const createNotification = async (userId, eventId, title, message, type) => {
    try {
        const notification = await Notification.create({
            userId,
            eventId,
            title,
            message,
            type,
        });
        return notification;
    } catch (err) {
        console.error('Error creating notification:', err);
        throw err;
    }
};

const getUserNotifications = async (req, res) => {
    try {
        const notifications = await Notification.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']],
        });
        res.json(notifications);
    } catch (err) {
        console.error('Get User Notifications Error:', err);
        res.status(500).json({ message: 'Internal server error occurred' });
    }
};

const markAsRead = async (req, res) => {
    const { id } = req.params;
    try {
        const notification = await Notification.findByPk(id);
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        if (notification.userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        await notification.update({ isRead: true });
        res.json(notification);
    } catch (err) {
        console.error('Mark Notification As Read Error:', err);
        res.status(500).json({ message: 'Internal server error occurred' });
    }
};

const getEventNotifications = async (req, res) => {
    const { eventId } = req.params;
    try {
        const event = await Event.findByPk(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        // Only organizer or admin can fetch notifications for an event
        if (event.organizerId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const notifications = await Notification.findAll({
            where: { eventId },
            order: [['createdAt', 'DESC']],
        });
        res.json(notifications);
    } catch (err) {
        console.error('Get Event Notifications Error:', err);
        res.status(500).json({ message: 'Internal server error occurred' });
    }
};

module.exports = {
    createNotification,
    getUserNotifications,
    markAsRead,
    getEventNotifications,
};