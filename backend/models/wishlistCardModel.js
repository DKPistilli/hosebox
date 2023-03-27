///
/// WISHLIST CARD SCHEMA
/// Note: This is *not* the model for a full Magic Card a la the JSON format
///       defined by Scryfall API. Wishlist Cards just wrap a pointer
///       to associated cardId/quantity tracker with card's owner userId.
///       Should be extremely close in fn to inventoryCardModel.js

const mongoose = require('mongoose');

const wishlistCardSchema = mongoose.Schema({

    "userId": {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "User ID for card-owner required."],
        ref: 'User'
    },

    "name": {
        type: String, // id to card in total_cards db
        required: [true, "Card Name required for adding card to wishlist."],
    },

    "quantity": {
        type: Number,
        default: 1,
    },
    
});

module.exports = mongoose.model("WishlistCard", wishlistCardSchema);