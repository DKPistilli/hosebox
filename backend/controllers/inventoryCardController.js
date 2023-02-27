///
/// INVENTORYCARD CONTROLLER
/// functions:
///      getCards, addCard


const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');

//import mongoose models
const User = require('../models/userModel');
const InventoryCard = require('../models/inventoryCardModel');

// Set limit of cards to be returned per page
const CARD_RES_LIMIT = 20;

// @ desc  Get inventory, filtered by page/search params
// @route  GET /api/inventoryCards/:userId
// @query  pg=(page number)&name=(card name or portion of card name)
// @access Public
const getCards = asyncHandler(async (req, res) => {

    //TBD -- HANDLE QUERY CASES (ie pg number and name)

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

// @ desc  Get inventory, filtered by page/search params
// @route  GET /api/inventoryCards/:userId
// @query  pg=(page number)&name=(card name or portion of card name)
// @access Public
const addCard = asyncHandler(async (req, res) => {

    const cardId   = req.query.cardId;
    const quantity = req.query.quantity;

    console.log(`cardId: ${cardId}`);
    console.log(`quantity: ${quantity}`);

    if (!cardId || !quantity) {
        res.status(400);
        throw new Error('CardId and Quantity required for card addition operation.');
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

module.exports = {
    getCards,
    addCard,
};
