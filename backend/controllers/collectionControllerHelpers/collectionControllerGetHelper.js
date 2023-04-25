const asyncHandler     = require('express-async-handler');
const scryfallCardsAPI = require('../scryfallCardController');
const Collection       = require('../../models/collectionModel');

// Set max limit of cards to be returned per page of non-deck-collection
const CARD_RES_LIMIT = 999;

// @res  res.collection
// @note collectionId already validated
const handleGetDeckCollection = asyncHandler(async (req, res) => {

    const collectionId = req.params.collectionId;

    // get deck from DB
    const deck = await Collection.findOne({ _id: collectionId });

    if (!deck || !collectionId) {
        res.status(404);
        throw new Error("Unable to find deck with ID: " + collectionId);
    }

    var responseDeck = deck;

    // use deck's card reference arrays to grab full scryfall cards from DB
    responseDeck.mainboard  = await scryfallCardsAPI.getCards(deck.mainboard);
    responseDeck.sideboard  = await scryfallCardsAPI.getCards(deck.sideboard);
    responseDeck.scratchpad = await scryfallCardsAPI.getCards(deck.scratchpad);

    res.status(200).json(responseDeck);
});

// @query  page=(page number)&limit=(# of results per page)
// @res    res.cards, res.previous, res.next, res.totalPages
// @note   collectionId already validated
const handleGetNonDeckCollection = asyncHandler(async (req, res) => {

    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || CARD_RES_LIMIT;

    const startIndex = (page - 1) * limit // 0 based index, ofc
    const endIndex   = page * limit;
    const results    = {}

    // grab collection from DB
    const collectionId = req.params.collectionId;
    const collection = await Collection.findOne({ _id: collectionId });

    if (!collection || !collectionId) {
        res.status(404);
        throw new Error("Unable to find collection with ID: " + collectionId);
    }

    // get current page of cards from collection
    const paginatedCards = collection.mainboard.slice(startIndex, endIndex);

    // track previous/next pages (if they exist)
    totalUniqueCards = collection.mainboard.length;

    if (startIndex > 0) {
        results.previous = {
            page: page - 1,
            limit,
        };
    }

    if (endIndex < results.totalUniqueCards) {
        results.next = {
            page: page + 1,
            limit,
        };
    }

    // find total # of pages in collection
    results.totalPages = Math.ceil(results.totalUniqueCards / limit);

    // populate cards with ScryfallDB, alphabetize, then return.
    results.cards = await scryfallCardsAPI.getCards(paginatedCards);
    results.cards.sort((a, b) => a.name.localeCompare(b.name));
    res.status(200).json(results);
});

// @return {mainboardSize: int >= 0, sideboardSize: int >= 0, scratchpadSize: int >= 0}
const handleGetCollectionSize = asyncHandler(async (req, res) => {

    // grab collection from DB
    const collectionId = req.params.collectionId;
    const collection = await Collection.findOne({ _id: collectionId });

    if (!collection || !collectionId) {
        res.status(404);
        throw new Error(`No collection found with ID: ${collectionId}`);
    }

    // accumulate the quantity of all the cards in the three arrays
    const mainboardSize = collection.mainboard.reduce((accumulator, currCard) => {
        return accumulator + currCard.quantity;
    }, 0);
    const sideboardSize = collection.sideboard.reduce((accumulator, currCard) => {
        return accumulator + currCard.quantity;
    }, 0);
    const scratchpadSize = collection.scratchpad.reduce((accumulator, currCard) => {
        return accumulator + currCard.quantity;
    }, 0);

    const results = {
        mainboardSize,
        sideboardSize,
        scratchpadSize,
    };

    res.status(200).json(results);
});

module.exports = {
    handleGetDeckCollection,
    handleGetNonDeckCollection,
    handleGetCollectionSize,
};