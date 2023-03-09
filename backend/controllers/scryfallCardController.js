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

    var scryfallCardsArray = await ScryfallCard.find({ id: { $in: idArray } });

    // for each card obj in scryfall card array, add associated quantity from input array
    scryfallCardsArray.map((scryfallCard) => {

        const i = cardsArray.findIndex((card) => {
            return (card.cardId === scryfallCard.id);
        });

        scryfallCard.quantity = cardsArray[i].quantity;
        console.log(scryfallCard.name + '  ' + scryfallCard.quantity);
    });

    return scryfallCardsArray;
});

module.exports = {
    getCards,
};
