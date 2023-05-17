///
/// COLLECTION SCHEMA
///
/// Defines a collection of cards and its owner
/// Structure: {
///     name:       String,
///     ownerId:    ObjectId (User),
///     isDeck:     bool,
///     isPublic:   bool,
///     mainboard:  [cardSubSchema],
///     sideboard:  [cardSubSchema],
///     scratchpad: [cardSubSchema],
/// }

const mongoose = require('mongoose');

// Note: NOT A FULL SCRYFALL CARD! Just wraps a cardname/quantity together.
const cardSubSchema = mongoose.Schema({
    
    // card name
    "name": {
        type: String,
        required: [true, "Card Name required for adding card to collection."],
    },

    // card quantity
    "quantity": {
        type: Number,
        default: 1,
    },
});

// COLLECTION DEFINITION
// Note: For Inventory/Wishlists, all cards exist in 'mainboard', name shouldn't matter, and isPublic is unalterably true
// Otherwise, it's a Deck, in which case, all main/side/scratch, isPublic, and name are all relevant and mutable.
const collectionSchema = mongoose.Schema({

    "name": {
        type: String, // collection name
        required: [true, "Name required to create a collection."],
    },

    "ownerId": {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "User ID for collection-owner required."],
        ref: 'User',
    },

    "isDeck": {
        type: Boolean,
        required: [true, "Collection must either be a deck or non-deck collection of cards."]
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
    
});

module.exports = mongoose.model("Collection", collectionSchema);