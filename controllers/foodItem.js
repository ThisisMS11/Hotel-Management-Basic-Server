const FoodItem = require('../models/FoodItem');
const asyncHandler = require('../middleware/asyncHandler');
const errorHandler = require('../utils/ErrorResponse');
const Hotel = require('../models/Hotel')

/* Add a new Hotel*/
exports.addFoodItem = asyncHandler(async (req, res, next) => {
    const { name, price, category, hotelId } = req.body;


    if (!name || !price || !category || !hotelId) {
        return next(new errorHandler('Please provide all required necessities', 400));
    }

    /* checking whether the hotel already exists or not */

    const foodItem = await FoodItem.findOne({ name });

    if (foodItem) {
        return next(new errorHandler('FoodItem with the given name already exists', 400));
    }

    try {
        const newFoodItem = await FoodItem.create(req.body)

        res.status(200).json({ msg: "New Food Item Added Successfully", newFoodItem });
    } catch (error) {
        res.status(500).json({ error });
    }
});

/* get all hotels details Controller */
exports.deleteFoodItem = asyncHandler(async (req, res, next) => {

    const foodItemID = req.params.id;

    try {

        /* find the corresponding foodItem */
        const foodItem = await FoodItem.findById(foodItemID);

        if (!foodItem) {
            return next(new errorHandler('No FoodItem Found', 400));
        }

        const hotel = await Hotel.findById(foodItem.hotelId);

        /*verifying authorisation */

        if (hotel.user.toString() !== req.user.id) {
            next(new errorHandler(`Not authorized to perform this action`, 401));
        }

        const deletionRes = await FoodItem.findByIdAndDelete(foodItemID);

        res.status(200).json({ msg: "FoodItem deleted Successfully ", deletionRes });
    } catch (error) {
        res.status(500).json({ error });
    }
});

/* Get hotels Details */
exports.updateFoodItem = asyncHandler(async (req, res) => {
    const foodItemID = req.params.id;

    if (!foodItemID) {
        return next(new errorHandler('Please provide FoodItemId to find the details of the respective food item', 400));
    }

    try {
        const food = await FoodItem.findById(foodItemID);
        if (!food) {
            next(new errorHandler(`foodItem not found`, 404));
        }

        /* find the hotel */
        const hotel = await Hotel.findById(food.hotelId);

        /*verifying authorisation */
        // console.log(req.user.id);
        // console.log(hotel.user.toString());

        if (hotel.user.toString() !== req.user.id) {
            next(new errorHandler(`Not authorized to perform this action`, 401));
        }

        const updationRes = await FoodItem.findByIdAndUpdate(foodItemID, req.body, {
            new: true
        });
        res.status(200).json({ msg: "updation Successfull ", updationRes });

    } catch (error) {
        res.status(500).json({ error });
    }
});
