const express = require('express');
const router = express.Router();
const historyController = require('../controllers/history.controllers');
const { apiKeyMiddleware } = require('../middlewares/auth.middlewares');

router.get('/', apiKeyMiddleware, historyController.getHistory);
router.post('/', apiKeyMiddleware, historyController.addHistory);
router.delete('/', apiKeyMiddleware, historyController.clearHistory);

module.exports = router;
