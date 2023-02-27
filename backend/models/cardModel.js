///
/// CARD SUB-SCHEMA FOR USE IN INVENTORY/DECK COLLECTIONS
/// Note: This is *not* the model for the objects in the total_cards database as
///       bulk-downloaded/uploaded from Scryfall. Our Card subschema just wraps a
///       pointer to associated scryfall card/oracle Id, alongside ax quantity tracker.

const mongoose = require('mongoose');

// define a card object with id pointing to a MtG card in cardDB
// default quantity of 1
const cardSchema = mongoose.Schema(
    {
        "cardId": {
            type: String, // id to card in total_cards db
            required: [true, "Card ID required."],
        },

        "oracleId": {
            type: String, //shared oracle id to consolidate diff printings of same card
            required: [true, "Oracle ID required."],
        },

        "name": {
            type: String, //card name e.g. "Goblin Guide"
            required: [true, "Card name required."],
        },
        
        "quantity": {
            type: Number,
            default: 1,
        },
    },
);

module.exports = cardSchema;