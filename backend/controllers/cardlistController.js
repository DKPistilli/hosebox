const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

// @ desc  Get total cardlist of all cards
// @route  GET /api/cardlist
// @access Public
const getCardPool = asyncHandler(async (req, res) => {
    const cardlist = await Cardlist.find();
});











/// IS THIS WHERE THESE SHOULD GO? OR SHOULD USERCONTROLLER HAVE?
/// I'M HAVING TROUBLE DECIDING WHICH ROUTES SHOUDL GET WHAT?

// @ desc  Get total cardlist of user
// @route  GET /api/cardlist/:userId/
// @access Private

// @ desc  Add card(s) to inventory of user
// @route  POST /api/cardlist/:userId/:cardId
// @access Private

// @ desc  Remove card from inventory of user
// @route  DELETE /api/cardlist/:userId/:cardId
// @access Private

// @ desc  Remove entire inventory of user
// @route  DELETE /api/cardlist/:userId
// @access Private