const mongoose = require('mongoose');
const { cardSchema } = require('./cardModel');

// define a card object with id pointing to a MtG card in cardDB
// default quantity of 1

const inventorySchema = mongoose.Schema({
    // inventory array of card refs & qtys
    cards: {
        type: [cardSchema],
        default: [],
    },

    // ref to inventory's owner
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "User required for inventory."],
        ref: 'User'
    },

}, {
    timestamps: true,
});

module.exports = mongoose.model('Inventory', inventorySchema);