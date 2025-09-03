const express = require('express');
const router = express.Router();
const { loginUser, getCurrentUser } = require('../controllers/authController');
const { auth } = require('../middleware/auth');

// Public routes
router.post('/login', loginUser);

// Protected routes
router.get('/me', auth, getCurrentUser);

module.exports = router;
