const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authProtect')
const { addFoodItem, deleteFoodItem, updateFoodItem } = require('../controllers/foodItem');


/* hotel id will come is req body */
router.post('/', protect, addFoodItem);
router.route('/:id').delete(protect, deleteFoodItem).put(protect, updateFoodItem);

module.exports = router;
