const cardPackController = require('../controllers/card.pack.controllers');
const express = require("express");
const router = express.Router();
const { authMiddleware } = require('../middlewares/auth.middlewares');

router.post('/open-pack', authMiddleware, cardPackController.rollPack);
router.post('/force-reset-collection', authMiddleware, cardPackController.forceResetCollection);

module.exports = router;