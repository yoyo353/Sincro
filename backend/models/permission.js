const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Relationship = require('./relationship');

const Permission = sequelize.define('Permission', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    relationship_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Relationship,
            key: 'id',
        },
        unique: true, // One permission set per relationship
    },
    can_view_phase: {
        type: DataTypes.BOOLEAN,
        defaultValue: true, // Default to sharing phase
    },
    can_view_exact_dates: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, // Default to privacy for exact dates
    },
    can_receive_alerts: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    tableName: 'permissions',
    timestamps: true,
    underscored: true,
});

// Associations
Relationship.hasOne(Permission, { foreignKey: 'relationship_id' });
Permission.belongsTo(Relationship, { foreignKey: 'relationship_id' });

module.exports = Permission;
