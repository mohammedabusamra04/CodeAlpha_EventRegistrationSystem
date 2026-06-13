const { Review, Event, User, Registration } = require('../models');

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
            return res.status(403).json({ message: 'You must attend the event before reviewing' });
        }

        const review = await Review.create({
            userId: req.user.id,
            eventId,
            rating,
            comment,
        });

        res.status(201).json(review);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getEventReviews = async (req, res) => {
    const { eventId } = req.params;
    try {
        const reviews = await Review.findAll({
            where: { eventId },
            include: [{ model: User, as: 'user', attributes: ['name'] }],
        });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deleteReview = async (req, res) => {
    const { id } = req.params;
    try {
        const review = await Review.findByPk(id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        if (review.userId !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        await review.destroy();
        res.json({ message: 'Review deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    createReview,
    getEventReviews,
    deleteReview,
};