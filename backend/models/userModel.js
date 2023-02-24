const mongoose = require('mongoose');
const cardlistSchema = require('./cardlistModel');
const deckSchema = require('./deckModel');

const userSchema = mongoose.Schema({

    name: {
        type: String,
        required: [true, "Name required for User"],
    },

    email: {
        type: String,
        required: [true, "Email required for User"],
        unique: true,
    },

    password: {
        type: String,
        required: [true, "Password required for User"],
    },

    inventory: {
        type: cardlistSchema,
        default: () => ({}),
    },

    decks: {
        type: [deckSchema],
        default: [],
    },

}, {
    timestamps: true,
});

module.exports = mongoose.model('User', userSchema);