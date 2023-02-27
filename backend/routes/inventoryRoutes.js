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
    getInventory,           // GET    /api/inventories/:user
    updateInventory,        // PUT    /api/inventories/:user/:oracleId
    deleteInventory,        // DELETE /api/inventories/:user    
} = require('../controllers/inventoryController');

// get inventory by page/search params, delete inventory in full (should be v rare!)
router.route('/:userId').get(getInventory).delete(protect, deleteInventory);

// update qty of card in inventory, creating/deleting card if necessary
router.route('/:userId/:cardId').put(protect, updateInventory);

module.exports = router;