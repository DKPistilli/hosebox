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

const { handleDeckNameChange,
        handlePrivacyChange,
        putCardInList,
        deleteCardInList,
        handleDeleteDeck, } = require('./deckControllerHelper');

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
    
    if (!deck) {
        res.status(404);
        throw new Error(`No deck found with deckId: ${deckId}`);
    }

    const scryfallMainboard  = await scryfallCardsAPI.getCards(deck.mainboard);
    const scryfallSideboard  = await scryfallCardsAPI.getCards(deck.sideboard);
    const scryfallScratchpad = await scryfallCardsAPI.getCards(deck.scratchpad);

    // create and send back a response deck with populated scryfall cards
    const responseDeck = {
        userId    : deck.userId,
        name      : deck.name,
        isPublic  : deck.isPublic,
        mainboard : scryfallMainboard,
        sideboard : scryfallSideboard,
        scratchpad: scryfallScratchpad,
    }

    res.status(200).json(responseDeck);
});

// @ desc  Create new deck
// @route  POST /api/decks/
// @query  deckName=(deckName) -- optional, will default to ""
// @access Private
const addDeck = asyncHandler(async (req, res) => {
    const deckName = req.query.deckName || "";
    const userId = req.user.id; // assigned by authMiddleware

    // add new deck to decks database
    const deck = await Deck.create({
        name: deckName,
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
// @query  listType=(listtype)&cardName=(cardName)&quantity=(quantity to set)
// @res    [cards] (updated cards array of the deck listType, main/side/scratch)
// @access Private
const updateDeck = asyncHandler(async (req, res) => {

    const userId   = req.user.id;
    const deckId   = req.params.deckId;
    const listType = req.query.listType;
    const cardName = req.query.cardName;
    const quantity = parseInt(req.query.quantity);

    // confirm req has all  parameters (note: this doesn't confirm their accuracy, just presence)
    if (!userId || !cardName || !mongoose.Types.ObjectId.isValid(deckId) || (quantity < 0)) {
        res.status(400);
        throw new Error('Request parameters invalid to update card in Deck.');
    }

    // get and verify deck from decksDb
    const deck = await Deck.findOne({_id: deckId});

    if (!deck) {
        res.status(400);
        throw new Error(`No deck found with id: ${deckId}`);
    }

    var cardsArray = [];

    // if quantity = 0, delete card from list (both helpers send res to client)
    if (quantity === 0) {
        cardsArray = await deleteCardInList(req, res, deckId, listType, cardName);
    } else {
        cardsArray = await putCardInList(req, res, deckId, listType, cardName, quantity);
    }

    const scryCardsArray = await scryfallCardsAPI.getCards(cardsArray);
    res.status(201).json(scryCardsArray);
});

// @ desc  update deck by listtype/cardId/quantity, deleting if needed
// @route  PUT /api/decks/:deckId/name
// @query  deckName="New Deck Name" Required.
// @access Private
const updateDeckName = asyncHandler(async (req, res) => {
    handleDeckNameChange(req, res, req.query.deckName, req.params.deckId)
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
    handleDeleteDeck(req, res);
});

module.exports = {
    getDeck,
    addDeck,
    updateDeck,
    updateDeckName,
    updateDeckPrivacy,
    deleteDeck,
};