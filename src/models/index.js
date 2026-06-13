const User = require('./User');
const Event = require('./Event');
const Category = require('./Category');
const Registration = require('./Registration');
const Review = require('./Review');
const Notification = require('./Notification');


User.hasMany(Event, { foreignKey: 'organizerId', as: 'organizedEvents' });
User.hasMany(Registration, { foreignKey: 'userId' });
User.hasMany(Review, { foreignKey: 'userId' });
User.hasMany(Notification, { foreignKey: 'userId' });


Category.hasMany(Event, { foreignKey: 'categoryId' });


Event.belongsTo(User, { foreignKey: 'organizerId', as: 'organizer' });
Event.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Event.hasMany(Registration, { foreignKey: 'eventId' });
Event.hasMany(Review, { foreignKey: 'eventId' });
Event.hasMany(Notification, { foreignKey: 'eventId' });

Registration.belongsTo(User, { foreignKey: 'userId' });
Registration.belongsTo(Event, { foreignKey: 'eventId' });

Review.belongsTo(User, { foreignKey: 'userId' });
Review.belongsTo(Event, { foreignKey: 'eventId' });

Notification.belongsTo(User, { foreignKey: 'userId' });
Notification.belongsTo(Event, { foreignKey: 'eventId' });

module.exports = {
    User,
    Event,
    Category,
    Registration,
    Review,
    Notification,
};