const asyncHandler     = require('express-async-handler');
const Collection       = require('../../models/collectionModel');
const User             = require('../../models/userModel');

const handleDeleteCollection = asyncHandler(async (req, res) => {
    
    // First, delete from decksDB    
    const collectionId = req.params.collectionId;

    const collection = await Collection.findByIdAndDelete(collectionId);

    if (!collection) {
        res.status(404);
        throw new Error(`Error deleting Collection. No collection found with given ID: ${collectionId}`);
    }

    console.log(JSON.stringify(collection));

    // if collection is not deck, you're done! Else, delete from owner's public or private decks array.
    if (!collection.isDeck) {
        res.status(204).send();
    } else {

        // then, find and update user deckslist (public or private)
        const user = await User.findById(req.user.id);

        if (!user) {
            res.status(404);
            throw new Error(`Error. No user found with given ID.`);
        }

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