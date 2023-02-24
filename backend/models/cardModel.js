const mongoose = require('mongoose');

// define a card object with id pointing to a MtG card in cardDB
// default quantity of 1
const cardSchema = mongoose.Schema(
    {
        "card": {
            type: String, // id to card Database
            required: [true, "Card ID required"],
        },
        
        "quantity": {
            type: Number,
            default: 1,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = cardSchema;