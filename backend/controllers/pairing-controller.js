const Relationship = require('../models/relationship');
const Permission = require('../models/permission');
const User = require('../models/user');
const { Op } = require('sequelize');

function generateCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

exports.invite = async (req, res) => {
    try {
        const ownerId = req.user.id;

        // Check if already has an active or pending relationship
        const existing = await Relationship.findOne({
            where: {
                owner_id: ownerId,
                status: { [Op.in]: ['PENDING', 'ACTIVE'] }
            }
        });

        if (existing) {
            // If pending, return existing code
            if (existing.status === 'PENDING') {
                return res.json({ code: existing.invitation_code });
            }
            return res.status(400).json({ message: 'User already has an active relationship' });
        }

        const code = generateCode();
        const relationship = await Relationship.create({
            owner_id: ownerId,
            invitation_code: code,
            status: 'PENDING'
        });

        res.json({ code: relationship.invitation_code });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.join = async (req, res) => {
    try {
        const viewerId = req.user.id;
        const { code } = req.body;

        if (!code) return res.status(400).json({ message: 'Code is required' });

        const relationship = await Relationship.findOne({
            where: { invitation_code: code, status: 'PENDING' }
        });

        if (!relationship) {
            return res.status(404).json({ message: 'Invalid or expired code' });
        }

        if (relationship.owner_id === viewerId) {
            return res.status(400).json({ message: 'Cannot pair with yourself' });
        }

        relationship.viewer_id = viewerId;
        relationship.status = 'ACTIVE';
        relationship.invitation_code = null; // Invalidate code
        await relationship.save();

        // Create default permissions
        await Permission.create({
            relationship_id: relationship.id
        });

        res.json({ message: 'Successfully paired' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.status = async (req, res) => {
    try {
        const userId = req.user.id;

        const relationship = await Relationship.findOne({
            where: {
                [Op.or]: [{ owner_id: userId }, { viewer_id: userId }],
                status: 'ACTIVE'
            },
            include: [
                { model: Permission },
                { model: User, as: 'Owner', attributes: ['display_name', 'email'] },
                { model: User, as: 'Viewer', attributes: ['display_name', 'email'] }
            ]
        });

        if (!relationship) {
            // Check for pending invite
            const pending = await Relationship.findOne({
                where: { owner_id: userId, status: 'PENDING' }
            });
            if (pending) {
                return res.json({ status: 'PENDING', code: pending.invitation_code });
            }
            return res.json({ status: 'NONE' });
        }

        const isOwner = relationship.owner_id === userId;
        const partner = isOwner ? relationship.Viewer : relationship.Owner;

        res.json({
            status: 'ACTIVE',
            role: isOwner ? 'OWNER' : 'VIEWER',
            partner,
            permissions: relationship.Permission
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updatePermissions = async (req, res) => {
    try {
        const userId = req.user.id;
        const { can_view_phase, can_view_exact_dates, can_receive_alerts } = req.body;

        const relationship = await Relationship.findOne({
            where: {
                owner_id: userId,
                status: 'ACTIVE'
            }
        });

        if (!relationship) {
            return res.status(404).json({ message: 'No active relationship found where you are the owner' });
        }

        const permission = await Permission.findOne({ where: { relationship_id: relationship.id } });
        if (permission) {
            if (can_view_phase !== undefined) permission.can_view_phase = can_view_phase;
            if (can_view_exact_dates !== undefined) permission.can_view_exact_dates = can_view_exact_dates;
            if (can_receive_alerts !== undefined) permission.can_receive_alerts = can_receive_alerts;
            await permission.save();
        }

        res.json({ message: 'Permissions updated', permission });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
