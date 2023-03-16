const express = require('express');
const router  = express.Router();

// import user controller functions
const { registerUser,
        loginUser,
        getMe,
        getUser, } = require('../controllers/userController');

// import auth middleware
const { protect } = require('../middleware/authMiddleware');

// set post routes for registering/logging in
router.post('/',      registerUser);
router.post('/login', loginUser);

// set get routes for getting users public/private data
router.get('/me',      protect, getMe);
router.get('/:userId', getUser )

module.exports = router;