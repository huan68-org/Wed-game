const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload.controllers');

router.post('/puzzle-image', uploadController.uploadPuzzleImage);

module.exports = router;
