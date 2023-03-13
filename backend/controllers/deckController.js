///
/// DECK CONTROLLER
/// Functions:
///      getDeck, addDeck, updateDeck, deleteDeck
/// Note:
///      Cards in a Deck are just proxies (just cardId + quantity), so we use ScryfallCards
///      db calls to convert these cardIds into fully populated cards for res to client

const asyncHandler = require('express-async-handler');
const mongoose     = require('mongoose');

//import Deck db + scryfall card helper function
const Deck             = require('../models/deckModel');
const scryfallCardsAPI = require('./scryfallCardController');

// @ desc  Get deck
// @route  GET /api/decks/:deckId
// @access Public (unless Deck is marked as private)
const getDeck = asyncHandler(async (req, res) => {
    const deckId = req.params.deckId;

    // throw error if given invalid type of ID
    if (!mongoose.Types.ObjectId.isValid(deckId)) {
        res.status(400);
        throw new Error('Request sent with invalid deckId');
    }
    
    const deck = await Deck.findOne({_id: req.params.deckId})
    
    if (deck) {
        res.status(200).json(deck);
    } else {
        res.status(404);
        throw new Error('No deck found with given deckId');
    }
});

// @ desc  Create new deck
// @route  POST /api/decks/
// @query  name=(name) -- optional
// @access Private
const addDeck = asyncHandler(async (req, res) => {
    const name = req.query.name || "";
    const userId = req.user.id; // assigned by authMiddleware
    const isPublic = true;

    if (!userId) {
        res.status(400);
        throw new Error('UserId required for new deck');
    }

    const deck = await Deck.create({
        name,
        userId,
        isPublic,
    });

    if (deck) {
        res.status(201).json(deck);
    } else {
        res.status(500);
        throw new Error('Server error generating new deck');
    }
});

// @ desc  update card in deck by listtypecardId/quantity, deleting if needed
// @route  PUT /api/decks/:deckId
// @query  list=(listtype)&cardId=(cardId)&quantity=(quantity to set)
// @access Private
const updateDeck = asyncHandler(async (req, res) => {
    // determine which list in deck we're updating
    // if quantity = 0, delete card from list
    // if card doesn't exist yet, add it
    // else update card quantity to given quantity
});

// @ desc  Delete deck
// @route  DELETE /api/decks/:deckId
// @access Private
const deleteDeck = asyncHandler(async (req, res) => {
    // delete deck reference from user's [decks]
    // delete deck from decksDB
});

module.exports = {
    getDeck,
    addDeck,
    updateDeck,
    deleteDeck,
};
