// async handler to wrap route functions, saving us try/catches
const asyncHandler = require('express-async-handler');

// @ desc  Get Goals
// @route  GET /api/goals
// @access Private
const getGoals = asyncHandler(async (req, res) => {
    res.status(200).json({ 'message': 'Get Goals' });
});

// @ desc  Create new goal
// @route  POST /api/goals
// @access Private
const setGoal = asyncHandler(async (req, res) => {
    if (!req.body.text) {
        res.status(400);
        throw new Error('Please add a text field');
    } else {
        console.log(req.body.text);
        res.status(200).json({ 'message': 'Set Goal' });
    }
});

// @ desc  Update goal at given id
// @route  PUT /api/goals/:id
// @access Private
const updateGoal = asyncHandler(async (req, res, id) => {
    res.status(200).json({ 'message': `Update goal at ID: ${req.params.id}` });
});

// @ desc  Delete goal at given id
// @route  DELETE /api/goal/:id
// @access Private
const deleteGoal = asyncHandler(async (req, res, id) => {
    res.status(200).json({ 'message': `Delete goal at ID: ${req.params.id}` });
});

// export callback GOAL REQUEST functions
module.exports = {
    "getGoals"  : getGoals,
    "setGoal"  : setGoal,
    "updateGoal": updateGoal,
    "deleteGoal": deleteGoal
}