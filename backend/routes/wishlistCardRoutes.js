///
/// WISHLIST ROUTES
/// Note: All routes private except for GET wishlist
///       so that users can search each other's wishlists w/o modifying.

const express = require('express');
const router  = express.Router();

// import auth middleware
const { protect } = require('../middleware/authMiddleware');

// import inventory controller functions
const {
    getCards,          // GET    /api/wishlists/:userId
    addCard,           // POST   /api/wishlists/:userId
    updateCard,        // PUT    /api/wishlists/:userId
    deleteCards,       // DELETE /api/wishlists/:userId  
} = require('../controllers/wishlistCardController');

// get inventory by page/search params, delete inventory in full (should be v rare!)
router.route('/:userId').get(getCards)
                        .post(protect, addCard)
                        .put(protect, updateCard)
                        .delete(protect, deleteCards);

module.exports = router;