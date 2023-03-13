///
/// DECK ROUTES
/// Note: All routes private except for GET deck so that users
///       can view each other's inventories w/o modifying.

const express = require('express');
const router  = express.Router();

// import auth middleware
const { protect } = require('../middleware/authMiddleware');

// import inventory controller functions
const {
    getDeck,           // GET    /api/decks/:deckId
    addDeck,           // POST   /api/decks/
    updateDeck,        // PUT    /api/decks/:deckId
    deleteDeck,        // DELETE /api/decks/:deckId  
} = require('../controllers/deckController');

router.route('/').post(protect, addDeck);
router.route('/:deckId').get(getDeck)
                        .put(protect, updateDeck)
                        .delete(protect, deleteDeck);

module.exports = router;