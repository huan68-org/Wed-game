const cardController = require("../controllers/card.controllers");
const express = require("express");
const router = express.Router();

router.get('/fetch-page', cardController.fetchPage);
router.get('/fetch-all', cardController.fetchAllCards);

module.exports = router;
