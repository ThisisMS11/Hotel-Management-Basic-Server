const Hotel = require('../models/Hotel');
const FoodItem = require('../models/FoodItem')
const asyncHandler = require('../middleware/asyncHandler');
const errorHandler = require('../utils/ErrorResponse');

/* Add a new Hotel*/
exports.addHotel = asyncHandler(async (req, res, next) => {
    const { name, location, rating, phoneNumber } = req.body;


    if (!name || !location || !phoneNumber) {
        return next(new errorHandler('Please provide all required necessities', 400));
    }

    /* checking whether the hotel already exists or not */
    const hotel = await Hotel.findOne({ name });

    if (hotel) {
        return next(new errorHandler('Hotel with the given name already exists', 400));
    }

    try {
        const newHotel = await Hotel.create({
            user: req.user.id,
            name, location, rating, phoneNumber
        })

        res.status(200).json({ newHotel });
    } catch (error) {
        res.status(500).json({ error });
    }
});

/* get all hotels details */
exports.getHotels = asyncHandler(async (req, res, next) => {

    try {
        const hotels = await Hotel.find();
        res.status(200).json({ hotels });
    } catch (error) {
        res.status(500).json({ error });
    }
});

/* Get hotels Details */
exports.getHotelDetails = asyncHandler(async (req, res) => {
    const hotelId = req.params.id;

    if (!hotelId) {
        return next(new errorHandler('Please provide HotelId to find the details of the respective hotel', 400));
    }

    try {
        const hotel = await Hotel.findById(hotelId);

        if (!hotel) {
            next(new errorHandler(`hotel not found`, 404));
        }

        res.status(200).json(hotel);
    } catch (error) {
        res.status(500).json({ error });
    }
});


// update the hotel details 
exports.updateHotelDetails = asyncHandler(async (req, res) => {

    const hotelId = req.params.id;

    try {

        const hotel = await Hotel.findById(hotelId);

        if (!hotel) {
            next(new errorHandler(`hotel not found`, 404));
        }

        if (hotel.user.toString() !== req.user.id) {
            next(new errorHandler(`Not authorized to perform this action`, 401));
        }

        const updationRes = await Hotel.findByIdAndUpdate(hotelId, req.body, {
            new: true
        });
        res.status(200).json(updationRes);

    } catch (error) {
        res.status(500).json({ error });
    }
});

// delete the hotel details
exports.deleteHotelDetails = asyncHandler(async (req, res) => {
    const hotelId = req.params.id;

    if (!hotelId) {
        return next(new errorHandler('Please provide HotelId to find the details of the respective hotel', 400));
    }

    try {

        console.log({ hotelId });

        const hotel = await Hotel.findById(hotelId);

        if (!hotel) {
            next(new errorHandler(`hotel not found`, 404));
        }

        if (hotel.user.toString() !== req.user.id) {
            next(new errorHandler(`Not authorized to perform this action`, 401));
        }


        const deletionRes = await Hotel.findByIdAndDelete(hotelId);
        res.status(200).json({ msg: "Deletion Successfull", deletionRes });
    } catch (error) {
        res.status(500).json({ error });
    }
});

/* get the food details of the hotel */
exports.getHotelFoodItems = asyncHandler(async (req, res) => {
    const hotelId = req.params.id;

    if (!hotelId) {
        return next(new errorHandler('Please provide HotelId to find the details of the respective hotel', 400));
    }
    try {

        const fooditems = await FoodItem.find({ hotelId: hotelId });
        res.status(200).json({ items: fooditems });
    } catch (error) {
        res.status(500).json({ error });
    }
});

