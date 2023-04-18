const asyncHandler = require('express-async-handler');
const scryfallCardsAPI = require('../scryfallCardController');
const Collection       = require('../../models/collectionModel');

// @ desc  Create new collection
// @route  POST /api/collections/
// @query  deckName=(deckName)
// @access Private
const handleCreateDeckCollection = asyncHandler(async (req, res) => {
    const deckName = req.query.deckName || "";
    const userId = req.user.id; // assigned by authMiddleware

    // add new deck to decks database
    const deck = await Collection.create({
        name: deckName,
        ownerId: userId,
        isDeck: true,
        isPublic: true,
        mainboard: [],
        sideboard: [],
        scratchpad: [],
    });

    if (!deck) {
        res.status(500)
        throw new Error('Server error while creating deck.');
    }

    // add ref to deck to associated user
    let userDeck = {
        deckId: deck._id,
        name  : deck.name,
    };
    
    const updatedUser = await User.findOneAndUpdate(
        { _id  : userId }, // filter to find correct user
        { $push: { decks_public: userDeck } }, // push userDeck to public decks
        { new  : true }, // return new user
    );

    if (!updatedUser) {
        res.status(500);
        throw new Error("Server error while updating the 'decks_public' collection");
    }

    res.status(201).json(deck);
});

// @ desc  Add cards with quantity/name to inventory 
// @query  listType=(listtype)
// @note   relies on cardlistMiddleware to set req.validCards and req.invalidCards
const handleAddCards = asyncHandler(async (req, res) => {

    const collectionId = req.params.collectionId;
    const listType     = req.params.listType || "mainboard";

    // grab and verify deck from Collection DB
    const deck = await Collection.findById(collectionId);
    if (!deck) {
        res.status(404);
        throw new Error('Unable to add to Collection. Invalid ID given.');
    }

    // verify active user matches deck owner
    if (req.user.id !== deck.ownerId) {
        res.status(403);
        throw new Error('Not authorized. UserID does not match collection ownerID');
    }

    // grab correct cardlist to add to.
    let cardlist;

    switch(listType) {
        case "mainboard":
            cardlist = deck.mainboard;
            break;
        case "sideboard":
            cardlist = deck.sideboard;
            break;
        case "scratchpad":
            cardlist = deck.scratchpad;
            break;
        default:
            res.status(400);
            throw new Error(`Invalid request listType: ${listType}`);
    }

    // if card isn't found by name, add it to list, else update it
    for (const validCard of req.validCards) {
        let indexToUpdate = cardlist.findIndex((card) => card.name === validCard.name);

        if (indexToUpdate === -1) {
            cardlist.push(validCard);
        } else {
            cardlist[indexToUpdate].quantity = validCard.quantity;
        }
    }

    // return error of any invalidCards, else success
    if (req.invalidCards.length > 0) {
        res.status(401);
        let errorString = 'Server error. Unable to add the following cards:\n';
        
        for (const card of req.invalidCards) {
            errorString += `${card.name}\n`;
        }

        throw new Error(errorString);
    } else {
        res.status(201).send();
    }
});

module.exports = {
    handleCreateDeckCollection,
    handleAddCards,
}