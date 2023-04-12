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
        console.log(`returning null 02`);
        return null;
    }

    let collectionToScryfallCard = null;

    // if card doesn't exist in collection, add it!
    // else, increment it by one.
    if (!collectionCard) {
        newCard = {
            userId: userId,
            name: cardName,
            quantity: quantity,
        };

        if (collectionType === "inventory") {
            collectionToScryfallCard = await InventoryCard.create(newCard);
        } else {
            collectionToScryfallCard = await WishlistCard.create(newCard);
        }

    } else {
        collectionCard.quantity += quantity;
        await collectionCard.save();
        collectionToScryfallCard = collectionCard;
    }
    
    if (!collectionToScryfallCard) {
        return null;
    }

    // get full scryfall card info for this updated card -- needs to be array
    // note: destructure array that's returned, to just return one card
    const scryfallCard = await scryfallCardsAPI.getCards([collectionToScryfallCard]);

    return scryfallCard[0];
});

module.exports = {
    addCardToCollection,
};