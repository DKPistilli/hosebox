///
/// DECK CONTROLLER
/// Functions:
///      getDeck, addDeck, updateDeck, deleteDeck
/// Note:
///      Cards in a Deck are just proxies (just cardId + quantity), so we use ScryfallCards
///      db calls to convert these cardIds into fully populated cards for res to client
/// Note:
///      Each user has public/private [decks], but each "deck" in the array is just {deckId, name}

const asyncHandler = require('express-async-handler');
const mongoose     = require('mongoose');

//import Deck db + scryfall card helper function
const Deck             = require('../models/deckModel');
const User             = require('../models/userModel');
const scryfallCardsAPI = require('./scryfallCardController');

const { handlePrivacyChange } = require('./deckControllerHelper');

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
// @query  name=(name) -- optional, will default to ""
// @access Private
const addDeck = asyncHandler(async (req, res) => {
    const name = req.query.name || "";
    const userId = req.user.id; // assigned by authMiddleware

    // add new deck to decks database
    const deck = await Deck.create({
        name,
        userId,
    });

    if (!deck) {
        res.status(500)
        throw new Error('Error creating deck.');
    }

    // add ref to deck to associated user
    let userDeck = {
        deckId: deck._id,
        name  : deck.name,
    };
    
    const updatedUser = await User.findOneAndUpdate(
        { _id  : userId }, // filter to find correct user
        { $push: { decks_public: userDeck } }, // push userDeck to public decks
        { new  : true }, // return new user
    );

    if (!updatedUser) {
        res.status(500);
        throw new Error('Error updating users decks_public collection');
    }

    res.status(201).json(deck);
});

// @ desc  update deck by listtype/cardId/quantity, deleting if needed
// @route  PUT /api/decks/:deckId
// @query  list=(listtype)&cardId=(cardId)&quantity=(quantity to set)
// @access Private
const updateDeck = asyncHandler(async (req, res) => {

    const userId = req.user.id;
    
    // throw error if given invalid type of ID
    const deckId = req.params.deckId;

    if (!mongoose.Types.ObjectId.isValid(deckId)) {
        res.status(400);
        throw new Error('Request sent with invalid deckId');
    }

    // determine which list in deck we're updating
    // if quantity = 0, delete card from list
    // if card doesn't exist yet, add it
    // else update card quantity to given quantity
    res.status(200).send('STUB IN UPDATEDECK');

});

// @ desc  update deck by listtype/cardId/quantity, deleting if needed
// @route  PUT /api/decks/:deckId/privacy
// @query  access=('public' or 'private') REQUIRED AND EXACT!
// @access Private
const updateDeckPrivacy = asyncHandler(async (req, res) => {

    handlePrivacyChange(req, res, req.query.access);

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
    updateDeckPrivacy,
    deleteDeck,
};