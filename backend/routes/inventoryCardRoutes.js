///
/// INVENTORY ROUTES
/// Note: All routes private except for GET inventory
///       so that users can search each other's inventories w/o modifying.

const express = require('express');
const router  = express.Router();

// import auth middleware
const { protect } = require('../middleware/authMiddleware');

// import inventory controller functions
const {
    getCards,          // GET    /api/inventories/:userId
    getInventorySize,  // GET    /api/inventories/:userId/size
    addCard,           // POST   /api/inventories/:userId
    updateCard,        // PUT    /api/inventories/:userId
    deleteCards,       // DELETE /api/inventories/:userId  
} = require('../controllers/inventoryCardController');

router.route('/').post(protect, addCard)
                 .put(protect, updateCard)
                 .delete(protect, deleteCards);

router.route('/:userId').get(getCards);
router.route('/:userId/size').get(getInventorySize);

module.exports = router;