const asyncHandler = require('express-async-handler');
const Deck             = require('../models/deckModel');
const User             = require('../models/userModel');

// updateDeckPrivacy helper function
const handlePrivacyChange = asyncHandler(async (req, res, access) => {

    const deckId = req.params.deckId;

    //
    // CASE 01: handle setting deck from private to public
    //
    if (access === "public") {
        
        // update isPublic on deck in decksDB
        const updatedDeck = await Deck.findOneAndUpdate(
            { _id: req.params.deckId }, // filter
            { isPublic: true },         // update isPublic placement
            { new: true },             // return new deck
        );

        if (!updatedDeck) {
            res.status(400);
            throw new Error('error updating deck privacy in decksDB');
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
            { _id: req.params.deckId }, // filter
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

        console.log(`deckIndex: ${deckIndex}`);

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

module.exports = {
    handlePrivacyChange,
}