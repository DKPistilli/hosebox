const mongoose = require('mongoose');

const deckSchema = mongoose.Schema({
/*

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "User ID for decklist required."],
        ref: 'User'
    },

    name: {
        type: String,
        default: "New Decklist",
    },

    mainboard: {

    },

    sideboard: {

    },

    scratchpad: {

    },

*/

});


mongoose.exports = mongoose.model('Deck', deckSchema);