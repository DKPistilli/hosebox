///
/// SCRYFALLCARD CONTROLLER
/// Functions:
///      getCards
/// Note:
///      Takes in [cards] and returns array of modified-scryfall card objects (add quantities, remove unnecessary fields);
///
/// Note: This is the by-hand command for importing the big dumb DL file from scryfall
///
/// mongoimport --uri 'mongodb+srv://username:password@hosebox0.cqgdq5c.mongodb.net/test?retryWrites=true&w=majority'
///             --collection='scryfallcards'
///             --file='./backend/cards/scryfallCards.json'
///             --jsonArray

const asyncHandler = require('express-async-handler');

//import mongoose models
const ScryfallCard = require('../models/scryfallCardModel');

// @ desc  Takes in [inventoryCards] and returns [modified scryfall card object] array
// @access Internal Only
const getCards = asyncHandler(async (cardsArray) => {

    if (!cardsArray) {
        throw new Error('Card array required to query ScryfallCards Database.');
    }

    // add all names from input array to name, for upcoming db query
    const nameArray = cardsArray.map((card) => card.name);


    // get all scryfallCards with corresponding names
    const scryfallCardsArray = await ScryfallCard.find({ name: { $in: nameArray } });

    // create new array of those cards, with quantity added and unnecessary info removed
    const scryfallWithQuantityArray = scryfallCardsArray.map((scryfallCard) => {

        const i = cardsArray.findIndex((card) => {
            return (card.name === scryfallCard.name);
        });

        if (i === -1) {
            throw new Error ('Server error attaching quantity to Scryfall cards.');
        }

        return ({
            // add quantity
            quantity        : cardsArray[i].quantity,

            // add other fields relevant to website (not all of scryfall info required)
            name            : scryfallCard.name,
            cardId          : scryfallCard.id,
            oracle_id       : scryfallCard.oracle_id,
            mana_cost       : scryfallCard.mana_cost,
            colors          : scryfallCard.colors,
            color_identity  : scryfallCard.color_identity,
            cmc             : scryfallCard.cmc,
            type_line       : scryfallCard.type_line,
            rarity          : scryfallCard.rarity,
            set_id          : scryfallCard.set_id,
            set             : scryfallCard.set,
            image_uris      : scryfallCard.image_uris,
            related_uris    : scryfallCard.related_uris,
            prices: scryfallCard.prices,
        });
    });
    return scryfallWithQuantityArray;
});

// @ desc  Takes in [inventoryCards] and returns [modified scryfall card object] array
// @access Internal Only
const isValidCardName = asyncHandler(async (cardName) => {

    if (!cardName) {
        throw new Error('CardName required to check if cardname is valid.');
    }

    // get all scryfallCards with corresponding names
    const scryfallCard = await ScryfallCard.findOne({ name: cardName });

    if (scryfallCard) {
        return true;
    } else {
        return false;
    }
});

module.exports = {
    getCards,
    isValidCardName,
};
