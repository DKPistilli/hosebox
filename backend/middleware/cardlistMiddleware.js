///
/// CARDLIST PARSER
///
/// Side effects: Takes a req.body cardlist in the following format:
///        Abc 3
///        Mno 7
///        Xyz 15
///        badName 0
/// and attaches an array of both valid/invalid cards:
/// req.validCards   = [{name: Abc, quantity: 3}, {name: Mno, quantity: 7}, {name: Xyz, quantity: 15}]
/// req.invalidCards = [{}]

/// TO DO: Do we want this to parse sideboard? Also this needs to work with multi-word card names lol

const scryfallCardsAPI = require('../controllers/scryfallCardController');
const asyncHandler = require('express-async-handler');

// takes in line of magic card "3 All Is Dust" and returns {name: "All Is Dust", quantity: 3}
const cardlineToObject = (cardText) => {

    // Regular expression to match the quantity and name
    const regex = /^(\d+)\s+(.+)$/;
  
    // Test the regex against the input cardText, [0] whole string, [1]quant, [2]cardname
    const match = regex.exec(cardText);
  
    // If there is a match, create an object with the matched properties
    if (match) {
      const quantity = parseInt(match[1], 10);
      const name = match[2].trim();
  
      return { name, quantity };
    }
  
    // If there's no match, return an empty object
    return {};
}

const cardlistParser = asyncHandler(async (req, res, next) => {
    // handle empty list
    if (!req.body) {
        res.status(400);
        throw new Error('No cardlist given to server for cardlist-required operation.')
    }

    // create array of lines, split by newline, filtering extra newlines
    const cardLines = req.body.split('\n').filter(line => line.trim() !== '');

    let cards = [];

    // create new array of card objects by parsing name/quant by space.
    cards = cardLines.map(line => cardlineToObject(line));

    const validCards   = [];
    const invalidCards = [];

    // separate cards by validation
    await Promise.all(cards.map(async card => {
        const validName = await scryfallCardsAPI.isValidCardName(card.name);
        const validQuantity = (Number.isInteger(card.quantity) && card.quantity > 0);

        if (validName && validQuantity) {
            validCards.push(card);
        } else {
            invalidCards.push(card);
        }
    }));

    // attach to req and move on!
    req.validCards = validCards;
    req.invalidCards = invalidCards;

    next();
});

module.exports = {
    cardlistParser,
};