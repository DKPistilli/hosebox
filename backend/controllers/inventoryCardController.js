///
/// INVENTORYCARD CONTROLLER
/// Functions:
///      getCards, addCard, updateCard (which handles deletion as well), deleteCards
/// Note:
///      User inventoryCards are just proxies (just name + quantity), so we also use scryfallCards db
///      scryfallCards db calls to convert these names into fully populated cards for res to client

const asyncHandler = require('express-async-handler');
const mongoose     = require('mongoose');

//import InventoryCard db + scryfall card helper function
const InventoryCard    = require('../models/inventoryCardModel');
const scryfallCardsAPI = require('./scryfallCardController');

// Set limit of cards to be returned per page
const CARD_RES_LIMIT = 100;

// @ desc  Get inventory, filtered by page/search params
// @route  GET /api/inventoryCards/:userId
// @query  page=(page number)&limit=(# of results)&cardName=(card cardName or portion of card name)
// @res    res.cards, res.previous, res.next, res.totalPages
// @access Public
const getCards = asyncHandler(async (req, res) => {

    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || CARD_RES_LIMIT;
    const cardName  = req.query.cardName || "";

    const startIndex = (page - 1) * limit // 0 based index, ofc
    const endIndex   = page * limit;      // page we're on * results per page
    const results    = {}

    if (!req.params.userId) {
        res.status(400);
        throw new Error('User Id required to get inventory.');
    }

    // filter by userId and by cardName (if given)
    var filter = {
        userId: req.params.userId,
    };

    if (cardName !== undefined) {
        filter = {
            ...filter,
            name: {"$regex": cardName, "$options": "i" } };
    }

    const inventoryCards = await InventoryCard
        .find(filter)
        .skip(startIndex)
        .limit(limit)
        .sort({ "name": 1 }) // STUB FOR TRUE SORTING!! HAVE TO FIX IN SCRYFALL CONTROLLER, TOO!
        .exec();

    // Check if there is a previous page
    if (startIndex > 0) {
        results.previous = {
            page : page - 1,
            limit: limit,
        };
    }

    // check if there is a next
    results.totalUniqueCards = await InventoryCard.countDocuments(filter);

    if (endIndex < results.totalUniqueCards) {
        results.next = {
            page: page + 1,
            limit: limit,
        };
    }

    results.totalPages = Math.ceil(results.totalUniqueCards / limit);
    results.cards = await scryfallCardsAPI.getCards(inventoryCards);

    res.status(200).json(results);
});

// @ desc  Get inventory size (total cards)
// @route  GET /api/inventoryCards/:userId/size
// @access Public
const getInventorySize = asyncHandler(async (req, res) => {

    const ownerId = req.params.userId;

    if (!ownerId || !mongoose.Types.ObjectId.isValid(ownerId)) {
        res.status(404);
        throw new Error(`No inventory found with owner of id: ${ownerId}`)
    }

    const result = await InventoryCard.aggregate([
        {
            $match: { userId: mongoose.Types.ObjectId(ownerId) }
        },
        { 
            $group: { _id: null, totalQuantity: { $sum: '$quantity' } }
        }
    ]);

    if (!result) {
        res.status(404);
        throw new Error(`Error finding inventory size of user with ID: ${ownerId}`);
    } else {
        const totalQuantity = result.length > 0 ? result[0].totalQuantity : 0;
        res.status(200).json(totalQuantity);
    }
});

// @ desc  Add card with id/quantity to inventory 
// @route  POST /api/inventoryCards
// @query  cardName=(cardName) -- if card is new to inventory, create. If card is already found, card.quantity++
// @access Private
const addCard = asyncHandler(async (req, res) => {

    const cardName        = req.query.cardName;
    const isValidName = await scryfallCardsAPI.isValidCardName(cardName);
    const quantity    = 1;

    if (!cardName || !isValidName) {
        res.status(400);
        throw new Error('Valid card name required for card addition operation.');
    }

    // find card by userId and name
    const inventoryCard = await InventoryCard.findOne({userId: req.user.id, name: cardName});
    let inventToScryfallCard = null;

    // if card doesn't exist in inventory, add it!
    // else, increment it by one.
    if (!inventoryCard) {

        newCard = {
            userId: req.user.id,
            name: cardName,
            quantity: quantity,
        };

        inventToScryfallCard = await InventoryCard.create(newCard);

    } else {
        inventoryCard.quantity += quantity;
        await inventoryCard.save();
        inventToScryfallCard = inventoryCard;
    }
    
    if (!inventToScryfallCard) {
        res.status(500);
        throw new Error('Server error adding card with name: ' + cardName + '.');
    }

    // get full scryfall card info for this updated card -- needs to be array
    // note: destructure array that's returned, to just return one card
    const scryfallCard = await scryfallCardsAPI.getCards([inventToScryfallCard]);

    res.status(201).json(scryfallCard[0]);
});

// @ desc  update card by name with quantity, deleting if needed
// @route  PUT /api/inventoryCards
// @query  cardName=(cardName)&quantity=(quantity to set) -- unlike addCard, quantity is required!
// @access Private
const updateCard = asyncHandler(async (req, res) => {

    const cardName   = req.query.cardName;
    const quantity = Number(req.query.quantity);

    // validate card name
    const isValidName = await scryfallCardsAPI.isValidCardName(cardName);

    if (!cardName || !isValidName) {
        res.status(400);
        throw new Error('Valid card name required for card addition operation.');
    }

    // confirm valid card quantity given
    if ( (quantity < 0) || (!Number.isInteger(quantity)) ) {
        res.status(400);
        throw new Error('Quantity required (must be non-negative integer).')
    }

    // find card by userId and cardName
    const filter = {
        userId: req.user.id,
        name  : cardName,
    };

    // update card with new Quantity
    const update = {
        userId  : req.user.id,
        name    : cardName,
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
        return;
    }

    const card = await InventoryCard.findOneAndUpdate(filter, update, settings);

    if (!card) {
        res.status(500);
        throw new Error('Server error adding card with name: ' + cardName + '.');
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
    getInventorySize,
    addCard,
    updateCard,
    deleteCards,
};