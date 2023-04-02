///
/// USER SCHEMA
///

const mongoose = require('mongoose');

// define the deckschema that is attached to users, which is just an array
// of names/deckIds for frontend to use to populate "Decks" sidebar links
const deckSubSchema = {
    deckId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Deck ID required when adding deck to User's public and/or private decks."],
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
        required: [true, "Name required for creating User."],
        unique: true,
    },

    email: {
        type: String,
        required: [true, "Email required for creating User."],
        unique: true,
    },

    // array of userIDs that represent whom User follows
    follows: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
    },

    password: {
        type: String,
        required: [true, "Password required for creating User."],
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