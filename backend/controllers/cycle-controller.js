const Cycle = require('../models/cycle');
const { Op } = require('sequelize');

// Get all cycles for the user
exports.getCycles = async (req, res) => {
    try {
        const cycles = await Cycle.findAll({
            where: { user_id: req.user.id },
            order: [['start_date', 'DESC']],
        });
        res.json(cycles);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error retrieving cycles' });
    }
};

// Start a new cycle (Log Period Start)
exports.startCycle = async (req, res) => {
    try {
        const { start_date } = req.body;

        // Check if there is already an open cycle (no end_date)
        const openCycle = await Cycle.findOne({
            where: {
                user_id: req.user.id,
                end_date: null
            }
        });

        if (openCycle) {
            return res.status(400).json({ message: 'There is already an active cycle please close it first.' });
        }

        const newCycle = await Cycle.create({
            user_id: req.user.id,
            start_date: start_date || new Date(),
        });

        res.status(201).json(newCycle);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error starting cycle' });
    }
};

// End a cycle (Log Period End)
exports.endCycle = async (req, res) => {
    try {
        const { end_date } = req.body;
        const today = end_date ? new Date(end_date) : new Date();

        // Find the most recent open cycle
        const cycle = await Cycle.findOne({
            where: {
                user_id: req.user.id,
                end_date: null
            },
            order: [['start_date', 'DESC']]
        });

        if (!cycle) {
            return res.status(400).json({ message: 'No active cycle found to end.' });
        }

        // Calculate cycle length if needed, or just marks period end?
        // Usually 'Cycle' implies the whole duration from Period 1 Start to Period 2 Start.
        // If the requirement "end_date" means "End of Bleeding" (Period End), we store that.
        // If "Cycle" means the Menstrual Cycle, then it ends when the NEXT one starts.
        // Based on user prompt: "marcar fin" (presumably of the period/bleeding or the cycle tracking?).
        // "Registrar Inicio de Periodo (o Fin si está activo)" implies we are tracking the BLEEDING phase duration or simply closing the cycle entry for UI.
        // Let's assume end_date marks the end of the entry for now.

        cycle.end_date = today;
        await cycle.save();

        res.json(cycle);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error ending cycle' });
    }
};
