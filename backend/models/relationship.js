const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const Relationship = sequelize.define('Relationship', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    owner_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    viewer_id: {
        type: DataTypes.UUID,
        allowNull: true, // Nullable until a partner joins
        references: {
            model: User,
            key: 'id',
        },
    },
    status: {
        type: DataTypes.ENUM('PENDING', 'ACTIVE', 'REJECTED'),
        defaultValue: 'PENDING',
    },
    invitation_code: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
}, {
    tableName: 'relationships',
    timestamps: true,
    underscored: true,
});

// Associations
User.hasMany(Relationship, { as: 'OwnedRelationships', foreignKey: 'owner_id' });
User.hasMany(Relationship, { as: 'ViewedRelationships', foreignKey: 'viewer_id' });
Relationship.belongsTo(User, { as: 'Owner', foreignKey: 'owner_id' });
Relationship.belongsTo(User, { as: 'Viewer', foreignKey: 'viewer_id' });

module.exports = Relationship;
