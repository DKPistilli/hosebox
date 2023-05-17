const express = require('express');
const router  = express.Router();

// import user controller functions
const { registerUser,
        loginUser,
        getMe,
        getUser,
        followUser,
        unfollowUser } = require('../controllers/userController');

// import auth middleware
const { protect } = require('../middleware/authMiddleware');

// set post routes for registering/logging in
router.post('/',      registerUser);
router.post('/login', loginUser);

// set get routes for getting users public/private data
router.get('/me',      protect, getMe);
router.get('/:userId',          getUser);

// set routes for following/unfollowing users
router.put('/:userId/follow',   protect, followUser);
router.put('/:userId/unfollow', protect, unfollowUser);

module.exports = router;