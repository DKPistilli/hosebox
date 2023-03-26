///
/// WISHLIST ROUTES
/// Note: All routes private except for GET wishlist
///       so that users can search each other's wishlists w/o modifying.

const express = require('express');
const router  = express.Router();

// import auth middleware
const { protect } = require('../middleware/authMiddleware');

// import wishlist controller functions
const {
    getCards,          // GET    /api/wishlists/:userId
    getWishlistSize,   // GET    /api/wishlists/:userId/size
    addCard,           // POST   /api/wishlists/:userId
    updateCard,        // PUT    /api/wishlists/:userId
    deleteCards,       // DELETE /api/wishlists/:userId  
} = require('../controllers/wishlistCardController');

// wishlist router functions
router.route('/').post(protect, addCard)
                 .put(protect, updateCard)
                 .delete(protect, deleteCards);
                 
router.route('/:userId').get(getCards)
router.route('/:userId/size').get(getWishlistSize)


module.exports = router;