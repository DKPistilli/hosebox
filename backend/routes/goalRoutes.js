const express = require('express');
const router  = express.Router();

// import goal Controller functions
const { getGoals, setGoal, updateGoal, deleteGoal } = require('../controllers/goalController');

// import auth middleware
const { protect } = require('../middleware/authMiddleware');

// set GET/POST goal routes
router.route('/').get(protect, getGoals).post(protect, setGoal);

// set PUT/DELETE routes (with id)
router.route('/:id').put(protect, updateGoal).delete(protect, deleteGoal);

module.exports = router;