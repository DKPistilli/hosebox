///
/// SCRYFALLCARD CONTROLLER
/// Functions:
///      getCards
/// Note:
///      Takes in [cards] and returns associated [scryfall card objects + quantities]
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

// @ desc  Takes in [inventoryCards] and returns associated [scryfall card objects]
// @access Internal Only
const getCards = asyncHandler(async (cardsArray) => {

    if (!cardsArray) {
        throw new Error('Card array required to query ScryfallCards Database.');
    }
    
    // add all cardIds from input array to idArray, for upcoming db query
    const idArray = [];

    cardsArray.map((card) => {
        idArray.push(card.cardId);
    });

    const scryfallCardsArray = await ScryfallCard.find({ id: { $in: idArray } });
    const scryfallCardsArrayWithQuantity = [];

    // for each card obj in scryfall card array, add associated quantity from input array
    scryfallCardsArray.map((scryfallCard) => {

        const i = cardsArray.findIndex((card) => {
            return (card.cardId === scryfallCard.id);
        });

        if (i === -1) {
            throw new Error ('Server error attaching quantity to Scryfall cards.');
        }

        scryfallCardsArrayWithQuantity.push({
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
            uri             : scryfallCard.uri,
            prices: scryfallCard.prices,
        });
    });

    return scryfallCardsArrayWithQuantity;
});

module.exports = {
    getCards,
};
