///
/// INVENTORY ROUTES
/// Note: All routes private except for GET
///       so that users can search each other's inventories w/o modifying.
const express = require('express');
const router  = express.Router();

// import middleware
const { protect } = require('../middleware/authMiddleware');
const { cardlistParser } = require('../middleware/cardlistMiddleware');

// import inventory controller functions
const {
    getCards,          // GET    /api/inventories/:userId
    getInventorySize,  // GET    /api/inventories/:userId/size
    addCard,           // POST   /api/inventories/
    addCards,           // POST   /api/inventories/list
    updateCard,        // PUT    /api/inventories/
    deleteCards,       // DELETE /api/inventories/  
} = require('../controllers/inventoryCardController');

router.route('/').post(protect, addCard)
                 .put(protect, updateCard)
                 .delete(protect, deleteCards);

router.route('/list').post(protect, cardlistParser, addCards);

router.route('/:userId').get(getCards);
router.route('/:userId/size').get(getInventorySize);

module.exports = router;