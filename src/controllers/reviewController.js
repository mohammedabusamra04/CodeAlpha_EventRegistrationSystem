const { Review, Event, User, Registration } = require('../models');
const { createNotification } = require('./notificationController');

const createReview = async (req, res) => {
    const { eventId } = req.params;
    const { rating, comment } = req.body;
    try {
        const event = await Event.findByPk(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        const registration = await Registration.findOne({
            where: { userId: req.user.id, eventId }
        });
        if (!registration) {
            return res.status(403).json({ message: 'You must register for the event before reviewing' });
        }

        const existingReview = await Review.findOne({
            where: { userId: req.user.id, eventId }
        });
        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this event' });
        }

        const review = await Review.create({
            userId: req.user.id,
            eventId,
            rating,
            comment,
        });

        // Notify organizer
        await createNotification(
            event.organizerId,
            eventId,
            'New Event Review',
            `A new review was submitted for your event "${event.title}" with a rating of ${rating}/5.`,
            'review'
        ).catch(err => console.error('Failed to create notification for review:', err));

        res.status(201).json(review);
    } catch (err) {
        console.error('Create Review Error:', err);
        res.status(500).json({ message: 'Internal server error occurred' });
    }
};

const getEventReviews = async (req, res) => {
    const { eventId } = req.params;
    try {
        const reviews = await Review.findAll({
            where: { eventId },
            include: [{ model: User, attributes: ['name'] }],
            order: [['createdAt', 'DESC']]
        });
        res.json(reviews);
    } catch (err) {
        console.error('Get Event Reviews Error:', err);
        res.status(500).json({ message: 'Internal server error occurred' });
    }
};

const deleteReview = async (req, res) => {
    const { id } = req.params;
    try {
        const review = await Review.findByPk(id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        if (review.userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        await review.destroy();
        res.json({ message: 'Review deleted successfully' });
    } catch (err) {
        console.error('Delete Review Error:', err);
        res.status(500).json({ message: 'Internal server error occurred' });
    }
};

module.exports = {
    createReview,
    getEventReviews,
    deleteReview,
};