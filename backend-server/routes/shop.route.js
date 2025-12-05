const express = require("express");
const router = express.Router();
const shopController = require("../../../../Wed-game/backend-server/controllers/shop.controller");
const { authMiddleware } = require("../middlewares/auth.middlewares");

router.post("/open-pack", authMiddleware, shopController.openPack);
router.get("/collection", authMiddleware, shopController.getCollection);

module.exports = router;
