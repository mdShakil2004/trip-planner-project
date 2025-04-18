// routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

router.get('/messages', chatController.getMessages);
router.post('/upload', chatController.uploadFile);
router.post('/avatar', chatController.uploadAvatar);
router.get('/avatar/:userId', chatController.getAvatar);

module.exports = router;