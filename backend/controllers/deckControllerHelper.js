const asyncHandler = require('express-async-handler');

// import models
const Deck             = require('../models/deckModel');
const User             = require('../models/userModel');
const { isValidCardName } = require('./scryfallCardController');

const handleDeckNameChange = asyncHandler(async (req, res, deckName, deckId) => {

    if (!deckName || !deckId) {
        res.status(400);
        throw new Error('deckName and ID required for updating Deck Name.');
    }

    const filter   = { _id: deckId };
    const update   = { name: deckName };
    const settings = { new: true };

    // update deck in decksDB
    const deck = await Deck.findOneAndUpdate(filter, update, settings);

    if (!deck || (deck.name !== deckName)) {
        res.status(400);
        throw new Error(`No deck found with id: ${deckId} at updateDeckName.`);
    }

    // then, find and update user deckName (could be public or private)
    const user = await User.findById(req.user.id);
    const publicIndex = user.decks_public.findIndex((deck) => deck.deckId.toString() === deckId);
    const privateIndex = user.decks_private.findIndex((deck) => deck.deckId.toString() === deckId);

    // if deck was public, delete from public list. Elif private, from private. Else, throw Error.
    if (publicIndex !== -1) {
        user.decks_public[publicIndex].name = deckName;
        await user.save();
        res.status(204).send();
    } else if (privateIndex !== -1) {
        user.decks_private[privateIndex].name = deckName;
        await user.save();
        res.status(204).send();
    } else {
        res.status(404);
        throw new Error(`Error deleting deck. No deck found in users public/private list with id: ${deckId}.`);
    }



});

// updateDeckPrivacy helper function
const handlePrivacyChange = asyncHandler(async (req, res, access) => {

    const deckId = req.params.deckId;

    //
    // CASE 01: handle setting deck from private to public
    //
    if (access === "public") {
        
        // update isPublic on deck in decksDB
        const updatedDeck = await Deck.findOneAndUpdate(
            { _id: deckId }, // filter
            { isPublic: true },         // update isPublic placement
            { new: true },             // return new deck
        );

        if (!updatedDeck) {
            res.status(400);
            throw new Error('Error updating deck privacy in Decks Database.');
        }

        // move deck from decks_private to decks_public for user in usersDB
        const user = await User.findById(req.user.id);
        if (!user) {
            res.status(404);
            throw new Error(`No user found with ${userId}`);
        }

        // handle error if deck not found in decks_private
        const deckIndex = user.decks_private.findIndex((deck) => deck.deckId.toString() === deckId);
        if (deckIndex === -1) {
            res.status(400);
            throw new Error('Error publicizing deck: deckId not found in users private decks');
        }

        // create userDeck (just name/id) to give to decks_public
        const updatedUserDeck = {
            deckId: deckId,
            name: updatedDeck.name,
        };

        // filter instead of splice, in case duplicate due to some edge case error
        const updatedDecksPrivate = user.decks_private.filter((deck) => deck.deckId.toString() !== deckId);
        const updatedDecksPublic  = [...user.decks_public, updatedUserDeck];

        // update the private/public arrays, and save User
        user.decks_private = updatedDecksPrivate;
        user.decks_public  = updatedDecksPublic;
        await user.save();

        res.status(200).json(updatedDeck);
    }

    //
    // CASE 02: handle setting deck from public to private
    //
    else if (access === "private") {
        // update isPublic on deck in decksDB
        const updatedDeck = await Deck.findOneAndUpdate(
            { _id: deckId }, // filter
            { isPublic: false },        // update isPublic placement
            { new: true },              // return updated deck
        );

        if (!updatedDeck) {
            res.status(400);
            throw new Error('error updating deck privacy in decksDB');
        }

        // move deck from decks_public to decks_private for user in usersDB
        const user = await User.findById(req.user.id);
        if (!user) {
            res.status(400);
            throw new Error(`No user found with ${userId}`);
        }

        // handle error if deck not found in decks_private
        const deckIndex = user.decks_public.findIndex((deck) => deck.deckId.toString() === deckId);

        if (deckIndex === -1) {
            res.status(400);
            throw new Error('Error privatizing deck: deckId not found in users public decks');
        }

        // create userDeck (just name/id) to give to decks_private
        const updatedUserDeck = {
            deckId: deckId,
            name: updatedDeck.name,
        };

        // filter instead of splice, in case duplicate due to some edge case error
        const updatedDecksPublic   = user.decks_public.filter((deck) => deck.deckId.toString() !== deckId);
        const updatedDecksPrivate  = [...user.decks_private, updatedUserDeck];

        // update the private/public arrays, and save User
        user.decks_public  = updatedDecksPublic;
        user.decks_private = updatedDecksPrivate;
        await user.save();

        res.status(200).json(updatedDeck);
    }

    //
    // CASE 03: handle incorrect access query
    //
    else {
        res.status(400);
        throw new Error('Access query must be exactly "public" or "private".');
    }
});

const putCardInList = asyncHandler(async (req, res, deckId, listType, name, quantity) => {
    // run input validation
    const deck = await Deck.findById(deckId);
    const validCardname = await isValidCardName(name);

    if (!deck) {
        res.status(404);
        throw new Error('Unable to delete card from list: invalid DeckId');
    }

    if (!validCardname) {
        res.status(404);
        throw new Error(`Invalid scryfall card name given: ${name}`);
    }

    if (listType !== "mainboard" &&
        listType !== "sideboard" &&
        listType !== "scratchpad") {
        res.status(400)
        throw new Error(`Invalid listType given for deleting card from list: ${listType}`);
    }

    // create new card to put/post
    const newCard = {
        name,
        quantity,
    };

    indexToUpdate = deck[listType].findIndex((card) => card.name === name);

    // if card isn't found by name, add it to list, else update it
    if (indexToUpdate === -1) {
        deck[listType].push(newCard);
    } else {
        deck[listType][indexToUpdate] = newCard;
    }

    // save and send!
    await deck.save();
    return deck[listType];
});

const deleteCardInList = asyncHandler(async (req, res, deckId, listType, name) => {
    
    // run input validation
    const deck = await Deck.findById(deckId);
    if (!deck) {
        res.status(400);
        throw new Error('Unable to delete card from list: invalid DeckId');
    }

    if (listType !== "mainboard" &&
        listType !== "sideboard" &&
        listType !== "scratchpad") {
        res.status(400)
        throw new Error(`Invalid listType given for deleting card from list: ${listType}`);
    }

    indexToRemove = deck[listType].findIndex((card) => card.name === name);

    if (indexToRemove === -1) {
        res.status(400);
        throw new Error(`Invalid name given for deleting card from list: ${name}`);
    } else {
        deck[listType].splice(indexToRemove, 1);
        await deck.save();
        return deck[listType];
    }
});

const handleDeleteDeck = asyncHandler(async (req, res) => {

    const deckId = req.params.deckId;
    // First, delete from decksDB    
    const result = await Deck.deleteOne({ _id: deckId });

    if (result.deletedCount !== 1) {
        res.status(404);
        throw new Error(`Unable to delete deck with id: ${deckId}`);
    }

    // then, find and update user deckslist (public or private)
    const user = await User.findById(req.user.id);
    const publicIndex = user.decks_public.findIndex((deck) => deck.deckId.toString() === deckId);
    const privateIndex = user.decks_private.findIndex((deck) => deck.deckId.toString() === deckId);

    // if deck was public, delete from public list. Elif private, from private. Else, throw Error.
    if (publicIndex !== -1) {
        user.decks_public.splice(publicIndex, 1)
        await user.save();
        res.status(204).send();
    } else if (privateIndex !== -1) {
        user.decks_private.splice(privateIndex, 1);
        await user.save();
        res.status(204).send();
    } else {
        res.status(404);
        throw new Error(`Error deleting deck. No deck found in users public/private list with id: ${deckId}`);
    }
});

module.exports = {
    handleDeckNameChange,
    handlePrivacyChange,
    putCardInList,
    deleteCardInList,
    handleDeleteDeck,
}