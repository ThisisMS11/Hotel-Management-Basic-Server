const mongoose = require('mongoose');

const HotelSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users', // collection name
        required: true
    },
    name: {
        type: String,
        required: [true, 'Please add a name'],
        maxlength: [50, 'Name can not have more than 50 characters']
    },
    location: {
        type: String,
        trim: true,
    },
    rating: {
        type: Number,
        default: 0
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    registeredOn: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Hotels', HotelSchema);
