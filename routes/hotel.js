const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authProtect')
const { addHotel, getHotels, getHotelDetails, deleteHotelDetails, updateHotelDetails } = require('../controllers/hotel');

router.route('/').post(protect, addHotel).get(protect, getHotels)

router.route('/:id').get(protect, getHotelDetails).delete(protect, deleteHotelDetails).put(protect, updateHotelDetails);



module.exports = router;
