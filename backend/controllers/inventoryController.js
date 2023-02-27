const asyncHandler = require('express-async-handler');

//import mongoose models
const User = require('../models/userModel');
const Inventory = require('../models/inventoryModel');

// Set limit of cards to be returned per page
const CARD_RES_LIMIT = 20

// @ desc  Get inventory, filtered by page/search params
// @route  GET /api/inventories/:userId
// @query  pg=(page number)&name=(card name or portion of card name)
// @access Public
const getInventory = asyncHandler(async (req, res) => {

    //TBD -- HANDLE QUERY CASES (ie pg number and name)

    const inventory = await Inventory
        .find({ user: req.params.userId }) // find inventory at given userId
        .limit(CARD_RES_LIMIT);            // limit cards back from db

    res.status(200).json(inventory);
});

// @ desc  Update qty of card inventory, creating/deleting card if necessary
// @route  PUT /api/inventories/:userId/:cardId
// @access Private
const updateInventory = asyncHandler(async (req, res) => {

    
});

// @ desc  Delete the ENTIRE inventory -- RARE, DANGEROUS, AND IRREVERSIBLE!!
// @route  DELETE /api/inventories/:userId
// @access Private
const deleteInventory = asyncHandler(async (req, res) => {

});

module.exports = {
    getInventory,
    updateInventory,
    deleteInventory,
};
