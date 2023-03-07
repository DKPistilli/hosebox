///
/// SCRYFALLCARD CONTROLLER
/// Functions:
///      getCards
/// Note:
///      Takes in [cardIds] and returns associated [scryfall card objects]
///
/// Note: This is the by-hand command for importing the big dumb DL file from scryfall
///
/// mongoimport --uri 'mongodb+srv://username:password@hosebox0.cqgdq5c.mongodb.net/test?retryWrites=true&w=majority'
///             --collection='scryfallcards'
///             --file='./backend/cards/scryfallCards.json'
///             --jsonArray

const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');

//import mongoose models
const ScryfallCard = require('../models/scryfallCardModel');

// @ desc  Takes in [inventoryCards] and returns associated [scryfall card objects]
// @access Internal Only
const getCards = asyncHandler(async (cardsArray) => {

    if (!cardsArray) {
        throw new Error('Card Ids required to query ScryfallCards Database.');
    }
    
    // add all cardIds from input array to idArray, for upcoming db query
    const idArray = [];

    cardsArray.map((card) => {
        idArray.push(card.cardId);
    });

    const scryfallCards = await ScryfallCard.find({ id: { $in: idArray } });

    return scryfallCards;
});

module.exports = {
    getCards,
};
