///
/// DECK SCHEMA
/// Note: Like most of the card logic in this app, decks DO NOT CONTAIN
///       CARDS AS DEFINED BY SCRYFALL API. Cards in decks just wrap a pointer
///       to associated cardId/quantity.

const mongoose = require('mongoose');

// card sub schema for use in the deck model
// each card is just a scryfallCardId + quantity
const cardSubSchema = {
    "cardId": {
        type: String,
        required: [true, "CardId required for card"],
    },
    "quantity": {
        type: Number,
        default: 1,
    },
};

// Decks should have userId, name, isPublic (default true)
// and 3 distinct card arrays (main/side/scratch)
const deckSchema = mongoose.Schema({

    "userId": {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "User ID for decklist required."],
        ref: 'User'
    },

    "name": {
        type: String,
        default: "New Decklist",
    },

    "isPublic": {
        type: Boolean,
        default: true,
    },

    "mainboard": {
        type: [cardSubSchema],
        default: [],
    },

    "sideboard": {
        type: [cardSubSchema],
        default: [],
    },

    "scratchpad": {
        type: [cardSubSchema],
        default: [],
    },

}, {
    timestamps: true,
});

module.exports = mongoose.model('Deck', deckSchema);