const mongoose = require('mongoose');
const cardlistSchema = require('./cardlistModel');

// define a deck with Name, Mainboard, Sideboard, Scratchpad, and associated User
const deckSchema = mongoose.Schema(
    {
        mainboard: {
            type: cardlistSchema,
            default: () => ({}),
        },

        sideboard: {
            type: cardlistSchema,
            default: () => ({}),
        },

        Name: {
            type: String,
            default: "Cloudpost",
        }
    },
    {
        timestamps: true,
    }
);

module.exports = deckSchema;