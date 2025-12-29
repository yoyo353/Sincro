const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const Cycle = sequelize.define('Cycle', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    end_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    cycle_length: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Length of the cycle in days',
    },
}, {
    tableName: 'cycles',
    timestamps: true,
    underscored: true,
});

module.exports = Cycle;
