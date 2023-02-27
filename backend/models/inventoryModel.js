const mongoose = require('mongoose');
const cardSchema = require('./cardModel');

const inventorySchema = mongoose.Schema({
    
    cards: [cardSchema],

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