const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Registration = sequelize.define('Registration', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'attended'),
        defaultValue: 'pending',
    },
    ticketCode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    paymentStatus: {
        type: DataTypes.ENUM('free', 'paid', 'refunded'),
        defaultValue: 'free',
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id',
        },
    },
    eventId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Events',
            key: 'id',
        },
    },
}, {
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['userId', 'eventId'],
        },
    ],
});

module.exports = Registration;