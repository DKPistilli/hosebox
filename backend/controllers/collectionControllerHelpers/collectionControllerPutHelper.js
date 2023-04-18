const asyncHandler = require('express-async-handler');
const scryfallCardsAPI = require('../scryfallCardController');
const Collection       = require('../../models/collectionModel');

// @desc   update quantity of card in collection by name/listType, deleting if needed
// @route  PUT /api/collections/:collectionId/
// @query  cardName=(cardName)&quantity=(quantity to set)&listType=(listtype)
// @access Private
const handleUpdateCardQuantity = asyncHandler(async (req, res) => {});

// @desc   update collection name
// @route  PUT /api/collections/:collectionId/name
// @query  collectionName=(collectionName)
// @access Private
const handleUpdateCollectionName = asyncHandler(async (req, res) => {});

// @desc   update card by name with quantity, deleting if needed
// @route  PUT /api/collections/:collectionId/privacy
// @query  cardName=(cardName)&quantity=(quantity to set)
// @access Private
const handleUpdateCollectionPrivacy = asyncHandler(async (req, res) => {});

module.exports = {
    handleUpdateCardQuantity,
    handleUpdateCollectionName,
    handleUpdateCollectionPrivacy,
};