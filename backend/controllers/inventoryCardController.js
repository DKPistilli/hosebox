///
/// INVENTORYCARD CONTROLLER
/// functions:
///      getCards, addCard, updateCard (which handles deletion as well), deleteCards

const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');

//import mongoose models
//const User = require('../models/userModel');
const InventoryCard = require('../models/inventoryCardModel');

// Set limit of cards to be returned per page
const CARD_RES_LIMIT = 20;

// @ desc  Get inventory, filtered by page/search params
// @route  GET /api/inventoryCards/:userId
// @query  pg=(page number)&name=(card name or portion of card name)
// @access Public
const getCards = asyncHandler(async (req, res) => {

    //TBD -- HANDLE QUERY CASES (ie pg number and name)
    if (req.query.pg || req.query.name) {
        console.log(`page: ${req.query.pg} name: ${req.query.name}`);
    }

    console.log(`userId: ${req.params.userId}`);

    const inventoryCards = await InventoryCard
        .find({ userId: req.params.userId }) // find inventory at given userId
        .limit(CARD_RES_LIMIT);            // limit cards back from db

    console.log(inventoryCards);

    if (!inventoryCards) {
        res.status(400);
        throw new Error('No inventory found at this userID.');
    }

    res.status(200).json(inventoryCards);
});

// @ desc  Add card with id/qty to inventory 
// @route  POST /api/inventoryCards/:userId/
// @query  cardId=(cardId)&qty=(qty to add, default to 1 if missing)
// @access Private
const addCard = asyncHandler(async (req, res) => {

    const DEFAULT_QTY = 1;

    const cardId   = req.query.cardId;
    const quantity = req.query.qty || DEFAULT_QTY;

    console.log(`cardId: ${cardId}`);

    if (!cardId) {
        res.status(400);
        throw new Error('CardId required for card addition operation.');
    }

    // find card by userId and cardId
    const filter = {
        userId: req.user.id,
        cardId: cardId,
    };

    // update card with new Quantity
    const update = {
        userId  : req.user.id,
        cardId  : cardId,
        quantity: quantity,
    };

    // db operation settings
    const settings = {
        new: true, // return updated card
        upsert: true, // if card not found, create
    };

    const card = await InventoryCard.findOneAndUpdate(filter, update, settings);

    if (!card) {
        res.status(500);
        throw new Error('Server error adding card.');
    }

    res.status(201).json(card);
});

// @ desc  update card by cardId with quantity, deleting if needed
// @route  PUT /api/inventoryCards/:userId
// @query  cardId=(cardId)&qty=(qty to set) -- unlike addCard, qty is required!
// @access Private
const updateCard = asyncHandler(async (req, res) => {

    const cardId   = req.query.cardId;
    const quantity = Number(req.query.qty);


    // confirm cardId given
    if (!cardId) {
        res.status(400);
        throw new Error('CardId required.');
    }

    // confirm valid card quantity given
    if ( (quantity < 0) || (!Number.isInteger(quantity)) ) {
        res.status(400);
        throw new Error('Qty must be non-negative integer.')
    }

    // find card by userId and cardId
    const filter = {
        userId: req.user.id,
        cardId: cardId,
    };

    // update card with new Quantity
    const update = {
        userId  : req.user.id,
        cardId  : cardId,
        quantity: quantity,
    };

    // db operation settings
    const settings = {
        new: true, // return updated card if found
        upsert: true,
    };

    // if updating to quantity of ZERO, delete card
    if (quantity === 0) {
        const deleteCard = await InventoryCard.deleteOne(filter);
        console.log(deleteCard);
        res.status(204).send();
    }

    const card = await InventoryCard.findOneAndUpdate(filter, update, settings);

    if (!card) {
        res.status(500);
        throw new Error('Server error adding card with cardId:' + cardId);
    }

    console.log(card);

    res.status(201).json(card);
});

// @ desc  Delete entire inventory -- SHOULD BE EXTREMELY RARE!
// @route  DELETE /api/inventoryCards/:userId
// @access Private
const deleteCards = asyncHandler(async (req, res) => {

    const filter = {
        userId: req.user.id,
    };

    const inventoryCards = await InventoryCard.deleteMany(filter);

    console.log(inventoryCards);

    if (inventoryCards) {
        res.status(500);
        throw new Error('Server error deleting all cards from inventory.');
    }

    res.status(24).json(inventoryCards);
});

module.exports = {
    getCards,
    addCard,
    updateCard,
    deleteCards,
};
