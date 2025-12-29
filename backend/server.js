const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth-routes');
const cycleRoutes = require('./routes/cycle-routes');
const User = require('./models/user');
const Cycle = require('./models/cycle');
require('dotenv').config();

// Associations
User.hasMany(Cycle, { foreignKey: 'user_id' });
Cycle.belongsTo(User, { foreignKey: 'user_id' });


const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Body Parser

// Routes
app.use('/auth', authRoutes);
app.use('/cycles', cycleRoutes);


// Test Route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Database Connection and Server Start
const PORT = process.env.PORT || 3000;

sequelize.sync() // Syncs models to database. In production, use migrations.
    .then(() => {
        console.log('Database connected and synced');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Database connection error:', err);
    });
