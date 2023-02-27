///
/// CARD SUB-SCHEMA FOR USE IN INVENTORY
/// Note: This is *not* the model for the objects in the total_cards database as
///       bulk-downloaded/uploaded from Scryfall. Our Card subschema just wraps a
///       pointer to associated scryfall card/oracle Id, alongside a quantity tracker,
///       basic common (and immutable) search/sort/display information

const mongoose = require('mongoose');

// define a card object with id pointing to a MtG card in cardDB
// default quantity of 1
const inventoryCardSchema = mongoose.Schema(
    {
        "userId": {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "User ID for card-owner required."],
            ref: 'User'
        },

        "cardId": {
            type: String, // id to card in total_cards db
            required: [true, "Card ID required."],
        },

        "quantity": {
            type: Number,
            default: 1,
        },
    },
);

module.exports = mongoose.model("InventoryCard", inventoryCardSchema);