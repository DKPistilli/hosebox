const asyncHandler     = require('express-async-handler');
const scryfallCardsAPI = require('../scryfallCardController');
const Collection       = require('../../models/collectionModel');
const User             = require('../../models/collectionModel');

const handleDeleteCollection = asyncHandler(async (req, res) => {
    
    // First, delete from decksDB    
    const collectionId = req.params.collectionId;
    const collection = Collection.findById({ _id: collectionId });

    const result = await Collection.deleteOne({ _id: collectionId });

    if (result.deletedCount < 1) {
        res.status(404);
        throw new Error(`Unable to delete deck with id: ${collectionId}`);
    }

    // if collection is not deck, you're done! Else, delete from owner's public or private decks array.
    if (!collection.isDeck) {
        res.status(204).send();
    } else {

        // then, find and update user deckslist (public or private)
        const user = await User.findById(req.user.id);
        const publicIndex = user.decks_public.findIndex((deck) => deck.deckId.toString() === collectionId);
        const privateIndex = user.decks_private.findIndex((deck) => deck.deckId.toString() === collectionId);

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
    }
});

module.exports = {
    handleDeleteCollection,
}