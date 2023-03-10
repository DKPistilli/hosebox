///
/// INVENTORY CARD SCHEMA
/// Note: This is *not* the model for a full Magic Card a la the JSON format
///       defined by Scryfall API. Inventory Cards just wrap a pointer
///       to associated cardId/quantity tracker with card's owner userId.

const mongoose = require('mongoose');

const inventoryCardSchema = mongoose.Schema({

    "userId": {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "User ID for card-owner required."],
        ref: 'User'
    },

    // "cardId": {
    //     type: String, // id to card in total_cards db
    //     required: [true, "Card ID required."],
    // },

    "name": {
        type: String, // card name
        required: [true, "Card name required."],
    },

    "quantity": {
        type: Number,
        default: 1,
    },
    
});

module.exports = mongoose.model("InventoryCard", inventoryCardSchema);