const express = require('express');
const router  = express.Router();

// import goal Controller functions
const { getGoals, setGoal, updateGoal, deleteGoal } = require('../controllers/goalController');

// set GET/POST goal routes
router.route('/').get(getGoals).post(setGoal);

// set PUT/DELETE routes (with id)
router.route('/:id').put(updateGoal).delete(deleteGoal);

module.exports = router;