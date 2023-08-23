const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authProtect')
const { addFoodItem, deleteFoodItem, updateFoodItem } = require('../controllers/hotel');


/* hotel id will come is req body */
router.post('/foodItem', protect, addFoodItem);
router.route('/foodItem/:id').delete(protect, deleteFoodItem).put(protect, updateFoodItem);

module.exports = router;
