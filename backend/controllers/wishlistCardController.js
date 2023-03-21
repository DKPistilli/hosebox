///
/// WISHLIST CARD CONTROLLER
/// Functions:
///      getCards, addCard, updateCard (which handles deletion as well), deleteCards
/// Note:
///      User wishlistCards are just proxies (just cardId + quantity), so we also use scryfallCards db
///      scryfallCards db calls to convert these cardIds into fully populated cards for res to client

const asyncHandler = require('express-async-handler');

//import wishlistCard db + scryfall card helper function
const WishlistCard = require('../models/wishlistCardModel');
const scryfallCardsAPI = require('./scryfallCardController');

// Set limit of cards to be returned per page
const CARD_RES_LIMIT = 100;

// @ desc  Get inventory, filtered by page/search params
// @route  GET /api/wishlistCards/:userId
// @query  page=(page number)&name=(card name or portion of card name)
// @access Public
const getCards = asyncHandler(async (req, res) => {

    //TBD -- HANDLE QUERY CASES (ie page number and name)
    if (req.query.page || req.query.name) {
        console.log(`page: ${req.query.page} name: ${req.query.name}`);
    }

    const wishlistCards = await WishlistCard
        .find({ userId: req.params.userId }) // find inventory at given userId
        .limit(CARD_RES_LIMIT);            // limit cards back from db

    const scryfallCards = await scryfallCardsAPI.getCards(wishlistCards);

    res.status(200).json(scryfallCards);
});


// @ desc  Add card with id/quantity to inventory 
// @route  POST /api/wishlistCards
// @query  name=(name)&quantity=(quantity to add, default to 1 if missing)
// @access Private
const addCard = asyncHandler(async (req, res) => {

    const DEFAULT_QTY = 1;

    const name     = req.query.name;
    const quantity = req.query.quantity || DEFAULT_QTY;

    // validate card name
    const isValidName = await scryfallCardsAPI.isValidCardName(name);

    if (!name || !isValidName) {
        res.status(400);
        throw new Error('Valid card name required for card addition operation.');
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
        new   : true, // return updated card
        upsert: true, // if card not found, create
    };

    const card = await WishlistCard.findOneAndUpdate(filter, update, settings);

    if (!card) {
        res.status(500);
        throw new Error('Server error adding card.');
    }

    const scryfallCard = await scryfallCardsAPI.getCards([card]);

    res.status(201).json(scryfallCard);
});


// @ desc  update card by name with quantity, deleting if needed
// @route  PUT /api/wishlistCards
// @query  name=(name)&quantity=(quantity to set) -- unlike addCard, quantity is required!
// @access Private
const updateCard = asyncHandler(async (req, res) => {

    const name     = req.query.name;
    const quantity = Number(req.query.quantity);


    // validate card name
    const isValidName = await scryfallCardsAPI.isValidCardName(name);

    if (!name || !isValidName) {
        res.status(400);
        throw new Error('Valid cardname required.');
    }

    // confirm valid card quantity given
    if ( (quantity < 0) || (!Number.isInteger(quantity)) ) {
        res.status(400);
        throw new Error('Quantity must be non-negative integer.')
    }

    // find card by userId and name
    const filter = {
        userId: req.user.id,
        name: name,
    };

    // update card with new Quantity
    const update = {
        userId  : req.user.id,
        name  : name,
        quantity: quantity,
    };

    // db operation settings
    const settings = {
        new: true, // return updated card if found
        upsert: true,
    };

    // if updating to quantity of ZERO, delete card
    if (quantity === 0) {
        await WishlistCard.deleteOne(filter);
        res.status(204).send();
    }

    const card = await WishlistCard.findOneAndUpdate(filter, update, settings);

    if (!card) {
        res.status(500);
        throw new Error('Server error adding card with name:' + name);
    }

    // get full scryfall card info for this updated card -- needs to be array
    const scryfallCards = await scryfallCardsAPI.getCards([card]);

    res.status(201).json(scryfallCards);
});

// @ desc  Delete entire inventory -- SHOULD BE EXTREMELY RARE!
// @route  DELETE /api/wishlistCards
// @access Private
const deleteCards = asyncHandler(async (req, res) => {

    const filter = {
        userId: req.user.id,
    };
    
    // delete all cards
    const deletedCount = await WishlistCard.deleteMany(filter);

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
