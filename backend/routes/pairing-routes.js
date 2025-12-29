const express = require('express');
const router = express.Router();
const pairingController = require('../controllers/pairing-controller');
const authMiddleware = require('../middlewares/auth-middleware');

router.use(authMiddleware);

router.post('/invite', pairingController.invite);
router.post('/join', pairingController.join);
router.get('/status', pairingController.status);
router.put('/permissions', pairingController.updatePermissions);

module.exports = router;
