// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { loginUser, createUser, getMe } = require('../controllers/LoginController');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.post('/login', loginUser);
router.post('/register', createUser);

router.get("/me", authenticateToken, getMe);


module.exports = router;