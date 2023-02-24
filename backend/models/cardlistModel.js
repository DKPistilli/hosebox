const mongoose = require('mongoose');
const cardSchema = require('./cardModel');

// RESTRICT THIS TO DECKLISTS, TRADELISTS, WISHLISTS, ETC.



// define an array of card objects (default empty) and type (default, no type)
// (type is used to differentiate between mainboard, sideboard, scratchpad, wishlist, etc)
const cardlistSchema = mongoose.Schema(
    {
        cards: {
            type: [cardSchema],
            default: [],
        },
        
        type: {
            type: String,
            default: "",
        }
    },
    {
        timestamps: true,
    }
);

module.exports = cardlistSchema;