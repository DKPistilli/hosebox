///
/// AUTH MIDDLEWARE
///
/// Side effects:
/// -- verifies user by Bearer token
/// -- sets req.user to user if verified

const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

// Authenticates user based off of token
// note: sets req.user to correct User, for use in following middleware in stack
const protect = asyncHandler(async (req, res, next) => {
    let token;

    // check auth token -- must start with 'Bearer' to have correct token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // split auth header into array of [0] "Bearer " and [1] "t0k3n" and grab [1]
            token = req.headers.authorization.split(' ')[1];

            // verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decoded);

            // get user from token, minus password
            req.user = await User.findById(decoded.id).select('-password');
            
            next();

        } catch (error) {
            console.log(error);
            res.status(401);
            throw new Error('Not authorized');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized. No token present in request body.');
    }

});

module.exports = { protect };