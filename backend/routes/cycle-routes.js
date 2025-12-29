const express = require('express');
const router = express.Router();
const cycleController = require('../controllers/cycle-controller');
const authMiddleware = require('../middlewares/auth-middleware');

router.use(authMiddleware); // Protect all cycle routes

router.get('/', cycleController.getCycles);
router.post('/start', cycleController.startCycle);
router.put('/end', cycleController.endCycle);

module.exports = router;
