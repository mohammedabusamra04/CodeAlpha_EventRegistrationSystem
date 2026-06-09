const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Review = sequelize.define('Review', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'User',
            key:'id',
        },
        eventId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Event',
                key:'id',
            },
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: { 
                min: 1,
                max: 5,
            },
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        timestamps: true,
        paranoid: true,
    },
);

module.exports = Review;