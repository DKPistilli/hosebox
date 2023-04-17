///
/// COLLECTION CONTROLLER
/// Functions:
///      getCollection, getCollectionSize, addCards, updateCardQuantity, deleteCollection
/// Note:
///      Cards in collections are just proxies (just name + quantity), so we also use scryfallCards db
///      scryfallCards db calls to convert these names into fully populated cards for res to client
const mongoose     = require('mongoose');
const asyncHandler = require('express-async-handler');
const Collection   = require ('../models/collectionModel');

const {
    handleGetDeckCollection,
    handleGetNonDeckCollection,
    handleGetCollectionSize,
} = require('./collectionControllerGetHelper');

/////////////////////
/// PUBLIC ROUTES ///
/////////////////////

// @ desc  Get collection by ID, filtered by page/search params
// @route  GET /api/collections/:collectionId/
// @query  (optional) page=(page number)&limit=(# of results)
// @res    res.cards, res.previous, res.next, res.totalPages
// @access Public (unless collection is private)
const getCollection = asyncHandler(async (req, res) => {
    const collectionId = req.params.collectionId;

    // throw error if given invalid type of ID
    if (!mongoose.Types.ObjectId.isValid(collectionId)) {
        res.status(400);
        throw new Error('Get Collection request sent with invalid collectionID format.');
    }

    const collection = await Collection.findOne({_id: collectionId});

    if (!collection) {
        res.status(404);
        throw new Error(`No colllection found with given ID: ${collectionId}`);
    } else if (collection.isDeck) {
        handleGetDeckCollection(req, res);
    } else {
        handleGetNonDeckCollection(req, res);
    }
});

// @ desc  Get inventory size (total cards)
// @route  GET /api/collections/:collectionId/size
// @return {mainboardSize: int >= 0, sideboardSize: int >= 0, scratchpadSize: int >= 0}
// @access Public
const getCollectionSize = asyncHandler(async (req, res) => {
    handleGetCollectionSize(req, res);
});

//////////////////////
/// PRIVATE ROUTES /// (note, req.user set by auth middleware fxn, "protect")
//////////////////////

// @ desc  Create new collection
// @route  POST /api/collections/
// @query  collectionName=(collectionName)&isDeck=(true/false)
// @access Private
const createCollection = asyncHandler(async (req, res) => {});

// @ desc  Add cards with name/quantity to inventory 
// @route  POST /api/collections/:collectionId/
// @query  listType=(listtype)
// @body   if card is new to inventory, create. If card is already found, card.quantity+=quantity
//         3 Cryptic Command\n
//         7 Murder\n
//         1 All Is Dust\n
// @note   relies on cardlistMiddleware to set req.validCards and req.invalidCards
// @access Private
const addCards = asyncHandler(async (req, res) => {});

// @desc   update quantity of card in collection by name/listType, deleting if needed
// @route  PUT /api/collections/:collectionId/
// @query  cardName=(cardName)&quantity=(quantity to set)&listType=(listtype)
// @access Private
const updateCardQuantity = asyncHandler(async (req, res) => {});

// @desc   update collection name
// @route  PUT /api/collections/:collectionId/name
// @query  collectionName=(collectionName)
// @access Private
const updateCollectionName = asyncHandler(async (req, res) => {});

// @desc   update card by name with quantity, deleting if needed
// @route  PUT /api/collections/:collectionId/privacy
// @query  cardName=(cardName)&quantity=(quantity to set)
// @access Private
const updateCollectionPrivacy = asyncHandler(async (req, res) => {});

// @desc   Delete entire inventory -- SHOULD BE RARE AND PROTECTED, CANNOT BE UNDONE!
// @route  DELETE /api/collections/:collectionId/
// @access Private
const deleteCollection = asyncHandler(async (req, res) => {});

module.exports = {
    getCollection,
    getCollectionSize,
    createCollection,
    addCards,
    updateCardQuantity,
    updateCollectionName,
    updateCollectionPrivacy,
    deleteCollection,
};