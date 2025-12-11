const express = require("express");
const router = express.Router();
const gameController = require("../controllers/game.controller");
const { authMiddleware } = require("../middlewares/auth.middlewares");

router.post("/finish", authMiddleware, gameController.finishGame);

module.exports = router;
