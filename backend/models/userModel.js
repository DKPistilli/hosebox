///
/// USER SCHEMA
///

const mongoose = require('mongoose');

// define the deckschema that is attached to users, which is just an array
// of names/deckIds for frontend to use to populate "Decks" sidebar links
const deckSubSchema = {
    deckId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Deck ID for decks owner required."],
        ref: 'Deck'
    },

    name: {
        type: String,
        required: [true, "Deck name required."],
    },
}

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

    decks_public: {
        type: [deckSubSchema],
        default: [],
    },

    decks_private: {
        type: [deckSubSchema],
        default: [],
    },

}, {
    timestamps: true,
});

module.exports = mongoose.model('User', userSchema);