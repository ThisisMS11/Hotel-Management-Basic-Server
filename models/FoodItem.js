const mongoose = require('mongoose');

const FoodItemSchema = new mongoose.Schema({
    hotelId: { type: String, required: true },
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    category: String,
    vegetarian: { type: Boolean, default: false },
})

module.exports = mongoose.model('FoodItems', FoodItemSchema);
