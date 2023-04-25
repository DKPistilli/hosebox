const asyncHandler = require('express-async-handler');
const scryfallCardsAPI = require('../scryfallCardController');
const Collection       = require('../../models/collectionModel');

// @desc   update quantity of card in collection by name/listType, deleting if needed
// @route  PUT /api/collections/:collectionId/
// @query  cardName=(cardName)&quantity=(quantity to set)&listType=(listtype)
// @access Private
const handleUpdateCardQuantity = asyncHandler(async (req, res) => {
    const collectionId = req.params.collectionId;
    const listType = String(req.query.listType);
    const cardName = String(req.query.cardName);
    const isValidName = await scryfallCardsAPI.isValidCardName(cardName);
    const quantity = parseInt(req.query.quantity);

    // validate request
    if (!collectionId || !listType || !cardName || quantity <= 0 || !Number.isInteger(quantity) || !isValidName) {
        res.status(400);
        throw new Error('Request to update card quantity is invalid.');
    }

    // grab & validate collection from DB
    const collection = await Collection.findById(collectionId);
    if (!collection) {
        res.status(404);
        throw new Error(`No collection found with given ID: ${collectionId}`);
    }

    // update correct card's quantity at correct index in given listtype
    var cardIndex;

    switch (listType) {
        case "mainboard":
            cardIndex = collection.mainboard.findIndex(card => card.name === cardName);
            if (cardIndex) {
                collection.mainboard[cardIndex].quantity = quantity;
            }
            break;
        case "sideboard":
            cardIndex = collection.sideboard.findIndex(card => card.name === cardName);
            if (cardIndex) {
                collection.sideboard[cardIndex].quantity = quantity;
            }
            break;
        case "scratchpad":
            cardIndex = collection.scratchpad.findIndex(card => card.name === cardName);
            if (cardIndex) {
                collection.scratchpad[cardIndex].quantity = quantity;
            }
            break;
        default:
            res.status(404);
            throw new Error(`Error updating card in invalid collection list type: ${listType}`);
    }

    // if card wasn't found, throw error, else save changes and return success
    if (cardIndex === -1) {
        res.status(404);
        throw new Error(`No card found in given collection/listType with name: ${cardName}`);
    } else {
        await collection.save();
        res.status(200).send();
    }
});

// @desc   update collection name
// @route  PUT /api/collections/:collectionId/name
// @query  collectionName=(collectionName)
// @access Private
const handleUpdateCollectionName = asyncHandler(async (req, res) => {
    const collectionId = req.params.collectionId;
    const collectionName = String(req.query.collectionName);

    // validate request
    if (!collectionId || !collectionName) {
        res.status(400);
        throw new Error('Invalid request parameters given while attempting to change collection name.');
    }

    // grab collection from DB, validate, and update name
    const collection = await Collection.findById(collectionId);
    if (!collection) {
        res.status(404);
        throw new Error(`No collection found with given ID: ${collectionId}`);
    } else {
        collection.name = collectionname;
        await collection.save();
    }

    // if collection is not a deck, you're done! Return success
    if (!collection.isDeck) {
        res.status(204).send();
    }
    
    // grab User from DB, validate, and update in their public/private decks array
    const user = await User.findById(collection.ownerId);
    if (!user) {
        res.status(404);
        throw new Error('This collection is not associated with any user.');
    } else {
        const publicIndex  = user.decks_public.findIndex(deck => deck.deckId.toString() === collectionId.toString());
        const privateIndex = user.decks_private.findIndex(deck => deck.deckId.toString() === collectionId.toString());

        if (publicIndex !== -1) {
            user.decks_public[publicIndex].name = collectionName;
            await user.save();
            res.status(204).send();
        } else if (privateIndex !== -1) {
            user.decks_private[privateIndex].name = collectionName;
            await user.save();
            res.status(204).send();
        } else {
            res.status(404);
            throw new Error(`Error updating collection name. No deck found in users public/private list with id: ${collectionId}.`);
        }

        await user.save();
        res.status(204).send();
    }
});

// @desc   update card by name with quantity, deleting if needed
// @route  PUT /api/collections/:collectionId/privacy
// @query  access=("public" or "private")
// @access Private
const handleUpdateCollectionPrivacy = asyncHandler(async (req, res) => {
    const collectionId = req.params.collectionId;
    const access = String(req.query.access);

    // validate ID was given and access is either public or private
    if (!collectionId || (access !== "public" && access !== "private")) {
        res.status(400);
        throw new Error('Invalid request parameters given while attempting to update collection privacy.');
    }

    // find, validate, and update collection in collection DB
    collection = Collection.findById(collectionId);
    if (!collection) {
        res.status(404);
        throw new Error(`No collection found with given ID: ${collectionId}`);
    } else {
        collection.isPublic = access === "public" ? true : false;
        await collection.save();
    }

    // grab User from DB and validate
    const user = User.findById(collection.ownerId);
    if (!user) {
        res.status(404);
        throw new Error('This collection is not associated with any user.');
    }

    // find Index of deck in correct list
    var deckIndex;
    if (access === "public") {
        deckIndex = user.decks_private.findIndex((deck) => deck.deckId.toString() === collectionId);
    } else {
        deckIndex = user.decks_public.findIndex((deck) => deck.deckId.toString() === collectionId);
    }

    // verify deck was found in correct list
    if (deckIndex === -1) {
        res.status(404);
        throw new Error('Error attempting to update privacy. Deck not found in User public/private deckslist');
    }

    // create new reference collection to give to User's list
    const referenceCollection = {
        deckId: collection._id,
        name: collection.name,
    };

    // update deck from private->public
    if (access === "public") {
        // filter instead of splice, in case duplicate due to some edge case error
        const updatedDecksPrivate   = user.decks_private.filter((deck) => deck.deckId.toString() !== collectionId);
        const updatedDecksPublic  = [...user.decks_public, referenceCollection];

        // update the private/public arrays, and save User
        user.decks_private = updatedDecksPrivate;
        user.decks_public  = updatedDecksPublic;

    // update deck from public->private
    } else if (access === "private") {
        // filter instead of splice, in case duplicate due to some edge case error
        const updatedDecksPublic   = user.decks_public.filter((deck) => deck.deckId.toString() !== collectionId);
        const updatedDecksPrivate  = [...user.decks_private, referenceCollection];

        // update the private/public arrays, and save User
        user.decks_private = updatedDecksPrivate;
        user.decks_public  = updatedDecksPublic;

    // if access is neither public nor private
    } else {
        res.status(400);
        throw new Error(`Error updating collection privacy. Invalid access given: ${access}`);
    }
    
    // save user and send success!
    await user.save();
    res.status(204).send();
});

module.exports = {
    handleUpdateCardQuantity,
    handleUpdateCollectionName,
    handleUpdateCollectionPrivacy,
};