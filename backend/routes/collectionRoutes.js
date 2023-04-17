///
/// COLLECTION ROUTES
/// Note: All routes private except for GET
///       so that users can search each other's inventories w/o modifying.
const express = require('express');
const router  = express.Router();

// import middleware
const { protect }        = require('../middleware/authMiddleware');
const { cardlistParser } = require('../middleware/cardlistMiddleware');

// import inventory controller functions
const {
    getCollection,           // GET    /api/collections/:collectionId
    getCollectionSize,       // GET    /api/collections/:collectionId/size
    createCollection,        // POST   /api/collections
    addCards,                // POST   /api/collections/:collectionId
    updateCardQuantity,      // PUT    /api/collections/:collectionId
    updateCollectionName,    // PUT    /api/collections/:collectionId/name
    updateCollectionPrivacy, // PUT    /api/collections/:collectionId/privacy
    deleteCollection,        // DELETE /api/collections/:collectionId
} = require('../controllers/collectionController');

// PUBLIC ROUTES
router.get('/:collectionId',      getCollection);
router.get('/:collectionId/size', getCollectionSize);

// PRIVATE ROUTES
router
    .post('/',                     protect,                 createCollection)
    .post('/:collectionId',        protect, cardlistParser, addCards)
    .put( '/:collectionId',        protect,                 updateCardQuantity)
    .put('/:collectionId/name',    protect,                 updateCollectionName)
    .put('/:collectionId/privacy', protect,                 updateCollectionPrivacy)
    .delete('/:collectionId',      protect,                 deleteCollection);

module.exports = router;