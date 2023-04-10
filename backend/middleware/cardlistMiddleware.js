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

const scryfallCardsAPI = require('../controllers/scryfallCardController');
const asyncHandler = require('express-async-handler');

const cardlistParser = asyncHandler(async (req, res, next) => {
    // handle empty list
    if (!req.body) {
        res.status(400);
        throw new Error('No cardlist given to server for cardlist-required operation.')
    }

    // create array of lines, split by newline
    const cardLines = req.body.cardlist.split('\n');

    let cards = [];

    // create new array of card objects by parsing name/quant by space.
    cards = cardLines.map(line => {
        const [name, quantity] = line.split(' ');
        return {
            name: name.trim(),
            quantity: parseInt(quantity, 10),
        };
    })

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