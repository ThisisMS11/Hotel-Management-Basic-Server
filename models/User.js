const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        maxlength: [50, 'Name can not have more than 50 characters']
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        minlength: [6, 'password cannot be shorted than 6 words'],
        select: false // to avoid password to come along with our query results.
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
})
/*In Mongoose, schema.methods is a property that allows you to add instance methods to your Mongoose models. Instance methods are methods that are available on individual documents retrieved from the database */

/*to check whether user input password matches with that of database one or not. */
UserSchema.methods.matchpassword = async function (password) {
    const result = await bcrypt.compare(password, this.password);
    return result;
}

UserSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id, password: this.password }, process.env.JWT_SECRET);
}

module.exports = mongoose.model('Users', UserSchema);
