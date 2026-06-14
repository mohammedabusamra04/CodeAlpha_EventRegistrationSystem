const { Notification } = require('../models');

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
        res.status(500).json({ message: err.message });
    }
};

const markAsRead = async (req, res) => {
    const { id } = req.params;
    try {
        const notification = await Notification.findByPk(id);
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        await notification.update({ isRead: true });
        res.json(notification);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getEventNotifications = async (req, res) => {
    const { eventId } = req.params;
    try {
        const notifications = await Notification.findAll({
            where: { eventId },
        });
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    createNotification,
    getUserNotifications,
    markAsRead,
    getEventNotifications,
};