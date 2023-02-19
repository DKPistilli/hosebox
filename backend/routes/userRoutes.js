const express = require('express');
const router  = express.Router();

// import user controller functions
const { registerUser, loginUser, getMe } = require('../controllers/userController');

// import auth middleware
const { protect } = require('../middleware/authMiddleware');

// set post routes for registering/logging in
router.post('/', registerUser);
router.post('/login', loginUser);

// set get route for getMe
router.get('/me', protect, getMe);

module.exports = router;