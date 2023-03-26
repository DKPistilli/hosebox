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
    addDeck,           // POST   /api/decks/
    getDeck,           // GET    /api/decks/:deckId
    updateDeck,        // PUT    /api/decks/:deckId
    updateDeckName,    // PUT    /api/decks/:deckId/name
    updateDeckPrivacy, // PUT    /api/decks/:deckId/privacy
    deleteDeck,        // DELETE /api/decks/:deckId  
} = require('../controllers/deckController');

router.route('/').post(protect, addDeck);

router.route('/:deckId').get(getDeck)
                        .put(protect, updateDeck)
                        .delete(protect, deleteDeck);

router.route('/:deckId/name')   .put(protect, updateDeckName);
router.route('/:deckId/privacy').put(protect, updateDeckPrivacy);

module.exports = router;