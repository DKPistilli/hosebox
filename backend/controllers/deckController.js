///
/// DECK CONTROLLER
/// Functions:
///      getDeck, addDeck, updateDeck, deleteDeck
/// Note:
///      Cards in a Deck are just proxies (just cardId + quantity), so we use ScryfallCards
///      db calls to convert these cardIds into fully populated cards for res to client

const asyncHandler = require('express-async-handler');

//import InventoryCard db + scryfall card helper function
const scryfallCardsAPI = require('./scryfallCardController');

// @ desc  Get deck
// @route  GET /api/decks/:deckId
// @access Public (unless Deck is marked as private)
const getDeck = asyncHandler(async (req, res) => {
});

// @ desc  Create new deck
// @route  POST /api/decks/
// @access Private
const addDeck = asyncHandler(async (req, res) => {
});

// @ desc  update card in deck by listtypecardId/quantity, deleting if needed
// @route  PUT /api/decks/:deckId
// @query  list=(listtype)&cardId=(cardId)&qty=(qty to set) -- unlike addCard, qty is required!
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
