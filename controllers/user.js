const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const errorHandler = require('../utils/ErrorResponse');
const bcrypt = require('bcrypt');

/* A function to send token response. */
const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getJwtToken();

    const options = {
        expires: new Date(
            Date.now() + 10 * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    }
    res.status(statusCode).cookie('token', token, options).send({ status: true, token: token });
}


/* login controller*/
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    console.log({email,password});


    if (!email || !password) {
        return next(new errorHandler('Please provide an email and password', 400));
    }

    // find in db
    const users = await User.find();

    console.log(users);

    const user = await User.findOne({ email: email }).select('+password');
    if (!user) {
        return next(new errorHandler('User not found with the given email', 404));
    }

    //confirm password
    const matchpasswordResult = await user.matchpassword(password);

    if (!matchpasswordResult) {
        return next(new errorHandler('Invalid Input', 404));
    }

    sendTokenResponse(user, 200, res);
});

/* Register Controller */
exports.register = asyncHandler(async (req, res, next) => {

    let { name, email, password } = req.body;

    if (!name || !email || !password) {
        return next(new errorHandler('Please provide an email and password', 400));
    }

    let user = await User.findOne({ email: email });

    if (user) {
        return next(new errorHandler('User with the given email already exists', 400));
    }

    /* creating user in database */
    const salt = bcrypt.genSaltSync(10);
    password = bcrypt.hashSync(password, salt);

    try {
        user = await User.create({ name, email, password });
        await user.save();
        sendTokenResponse(user, 200, res);

    } catch (error) {
        res.status(403).send({ error })
    }
});

exports.logout = asyncHandler(async (req, res) => {
    
    /* To set the token cookie to none at the browser */
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    })

    res.status(200).send({ status: "success", data: {} })
});
