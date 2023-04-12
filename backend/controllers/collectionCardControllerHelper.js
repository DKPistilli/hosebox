const asyncHandler = require('express-async-handler');
const scryfallCardsAPI = require('./scryfallCardController');
const InventoryCard    = require('../models/inventoryCardModel');
const WishlistCard     = require('../models/wishlistCardModel');

// @ desc  Add card with name/quantity to collection 
// @args   cardName, quantity, userId, collectionType ("inventory" || "wishlist");
// @return {card} if successful, null if unsuccessful
const addCardToCollection = asyncHandler(async (cardName, quantity, userId, collectionType) => {

    const isValidName = await scryfallCardsAPI.isValidCardName(cardName);

    if (!cardName || !userId || quantity <= 0 || !Number.isInteger(quantity) || !isValidName ) {
        return null;
    }

    // find card by userId/name/collectionType
    let collectionCard;
    if (collectionType==="inventory") {
        collectionCard = await InventoryCard.findOne({userId: userId, name: cardName});
    } else if (collectionType==="wishlist") {
        collectionCard = await WishlistCard.findOne({userId: userId, name: cardName});
    } else {
        return null;
    }

    let returnCard = null;

    // if card doesn't exist in collection, add it!
    // else, increment it by one.
    if (!collectionCard) {
        newCard = {
            userId: userId,
            name: cardName,
            quantity: quantity,
        };

        if (collectionType === "inventory") {
            returnCard = await InventoryCard.create(newCard);
        } else {
            returnCard = await WishlistCard.create(newCard);
        }

    } else {
        collectionCard.quantity += quantity;
        await collectionCard.save();
        returnCard = collectionCard;
    }
    
    if (!returnCard) {
        return null;
    }

    return returnCard;
});

module.exports = {
    addCardToCollection,
};