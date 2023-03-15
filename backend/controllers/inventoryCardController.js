///
/// INVENTORYCARD CONTROLLER
/// Functions:
///      getCards, addCard, updateCard (which handles deletion as well), deleteCards
/// Note:
///      User inventoryCards are just proxies (just name + quantity), so we also use scryfallCards db
///      scryfallCards db calls to convert these names into fully populated cards for res to client

const asyncHandler = require('express-async-handler');

//import InventoryCard db + scryfall card helper function
const InventoryCard    = require('../models/inventoryCardModel');
const scryfallCardsAPI = require('./scryfallCardController');
const mongoose         = require('mongoose');

// Set limit of cards to be returned per page
const CARD_RES_LIMIT = 100;

// @ desc  Get inventory, filtered by page/search params
// @route  GET /api/inventoryCards/:userId
// @query  pg=(page number)&name=(card name or portion of card name)
// @access Public
const getCards = asyncHandler(async (req, res) => {

    //TBD -- HANDLE QUERY CASES (ie pg number and name)
    if (req.query.pg || req.query.name) {
        console.log(`page: ${req.query.pg} name: ${req.query.name}`);
    }

    const inventoryCards = await InventoryCard
        .find({ userId: req.params.userId }) // find inventory at given userId
        .limit(CARD_RES_LIMIT);            // limit cards back from db

    const scryfallCards = await scryfallCardsAPI.getCards(inventoryCards);

    res.status(200).json(scryfallCards);
});


// @ desc  Add card with id/quantity to inventory 
// @route  POST /api/inventoryCards
// @query  name=(name) -- if card is new to inventory, create. If card is already found, card.quantity++
// @access Private
const addCard = asyncHandler(async (req, res) => {

    const name        = req.query.name;
    const isValidName = await scryfallCardsAPI.isValidCardName(name);
    const quantity    = 1;

    if (!name || !isValidName) {
        res.status(400);
        throw new Error('Valid card name required for card addition operation.');
    }

    // find card by userId and name
    const inventoryCard = await InventoryCard.findOne({userId: req.user.id, name: name});
    // if card doesn't exist in inventory, add it!
    // else, increment it by one.
    if (!inventoryCard) {

        const newCard = {
            userId: req.user.id,
            name: name,
            quantity: quantity,
        };

        await InventoryCard.create(newCard);

    } else {
        inventoryCard.quantity += quantity;
        await inventoryCard.save();
    }

    res.status(201).send();
});


// @ desc  update card by name with quantity, deleting if needed
// @route  PUT /api/inventoryCards
// @query  name=(name)&quantity=(quantity to set) -- unlike addCard, quantity is required!
// @access Private
const updateCard = asyncHandler(async (req, res) => {

    const name   = req.query.name;
    const quantity = Number(req.query.quantity);

    // validate card name
    const isValidName = await scryfallCardsAPI.isValidCardName(name);

    if (!name || !isValidName) {
        res.status(400);
        throw new Error('Valid card name required for card addition operation.');
    }

    // confirm valid card quantity given
    if ( (quantity < 0) || (!Number.isInteger(quantity)) ) {
        res.status(400);
        throw new Error('Quantity required (must be non-negative integer).')
    }

    // find card by userId and name
    const filter = {
        userId: req.user.id,
        name  : name,
    };

    // update card with new Quantity
    const update = {
        userId  : req.user.id,
        name    : name,
        quantity: quantity,
    };

    // db operation settings
    const settings = {
        new   : true, // return updated card if found
        upsert: true,
    };

    // if updating to quantity of ZERO, delete card
    if (quantity === 0) {
        await InventoryCard.deleteOne(filter);
        res.status(204).send();
    }

    const card = await InventoryCard.findOneAndUpdate(filter, update, settings);

    if (!card) {
        res.status(500);
        throw new Error('Server error adding card with name: ' + name);
    }

    // get full scryfall card info for this updated card -- needs to be array
    const scryfallCards = await scryfallCardsAPI.getCards([card]);

    res.status(201).json(scryfallCards);
});

// @ desc  Delete entire inventory -- SHOULD BE EXTREMELY RARE!
// @route  DELETE /api/inventoryCards
// @access Private
const deleteCards = asyncHandler(async (req, res) => {

    const filter = {
        userId: req.user.id,
    };
    
    // delete all cards
    const deletedCount = await InventoryCard.deleteMany(filter);

    if (deletedCount === 0) {
        res.status(500);
        throw new Error('Server error deleting all cards from inventory.');
    } else {
        res.status(204).send();
    }

});

module.exports = {
    getCards,
    addCard,
    updateCard,
    deleteCards,
};
