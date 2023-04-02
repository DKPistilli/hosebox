const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');

const { lowerAllButFirstChar,
        isValidUsername,
        isValidEmail } = require('./userControllerHelper');

//import collections
const User = require('../models/userModel');

// Generate JWT based off of userId
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '90d' });
}

// @desc   Register new user
// @route  POST /api/users
// @body   name="name", email="email", password="password"
// @access Public
const registerUser = asyncHandler(async (req, res) => {

    const { name, email, password } = req.body;

    // verify req body contains necessary information
    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Unable to create new User. Please add all required fields (name/email/password).');
    }

    // basic input validation on username/email. Does not take place of email confirmation link.
    if (!isValidUsername(name)) {
        res.status(400);
        throw new Error(`Unable to create new User: invalid username given (${name}).`)
    } else if (!isValidEmail(email)) {
        res.status(400);
        throw new Error(`Unable to create new User: invalid email given (${email}).`)
    }

    const formattedUsername = lowerAllButFirstChar(name);
    const formattedEmail = lowerAllButFirstChar(email);

    // check if user already exists with that formattedUsername
    const nameExists = await User.findOne({ name: formattedUsername });
    if (nameExists) {
        res.status(400);
        throw new Error(`Error: User already exists with username "${formattedUsername}"`);
    }

    // check if user already exists with that email
    const emailExists = await User.findOne({ email: formattedEmail });
    if (emailExists) {
        res.status(400);
        throw new Error(`Error: User already exists with email ${formattedEmail}.`);
    }

    // hash password for privacy
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create new user
    const user = await User.create({
        name: formattedUsername,
        email: formattedEmail,
        password: hashedPassword,
    });

    if (user) {
        res.status(201).json({
            _id  : user.id,
            name : user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Unable to create user, missing required fields.');
    }
});

// @ desc  Authentite a user
// @route  POST /api/users/login
// @body   email="email", password="password"
// @access Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const formattedEmail = lowerAllButFirstChar(email)

    // check for user email in db
    const user = await User.findOne({ email: formattedEmail });

    if (!user) {
        res.status(401);
        throw new Error('No user found with given email address.');
    }

    // veryify password
    const matchingPasswords = await bcrypt.compare(password, user.password);

    // if user exists and password matches, send back user info res, else error
    if (user && matchingPasswords) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid credentials');
    }
});

// @ desc  Get user's public data (name, decks_public)
// @route  GET /api/users/:userId
// @access Public
const getUser = asyncHandler(async(req, res) => {

    if (!req.params.userId) {
        res.status(400)
        throw new Error(`User ID required for Get User operation.`)
    }

    const returns = 'name decks_public'
    const user    = await User.findOne({'_id': req.params.userId}, returns);

    if (!user) {
        res.status(400);
        throw new Error(`No user found with id: ${req.params.userId}`);
    } else {
        res.status(200).json(user);
    }
});

// @ desc  Get user's data (sans password)
// @route  GET /api/users/me
// @access Private
const getMe = asyncHandler(async (req, res) => {
    // errors handled in authMiddleware.js
    res.status(200).json(req.user);
});

// @ desc  Follow user @ given userId
// @route  PUT /api/users/:userId/follow
// @access Private
const followUser = asyncHandler(async (req, res) => {

    const idToFollow = req.params.userId;

    if (!req.user || !idToFollow) {
        res.status(404);
        throw new Error('Error while attempting to follow user.');
    }

    if (req.user.follows.includes(idToFollow)) {
        res.status(400);
        throw new Error('You are already following this user.');
    }

    req.user.follows = [...req.user.follows, idToFollow];
    
    await req.user.save();

    res.status(201).json(req.user.follows);
});

// @ desc  Unfollow user @ given userId
// @route  PUT /api/users/:userId/unfollow
// @access Private
const unfollowUser = asyncHandler(async (req, res) => {

    const idToUnfollow = req.params.userId;

    if (!req.user || !idToUnfollow) {
        res.status(404);
        throw new Error('Error while attempting to unfollow user.');
    }

    if (!req.user.follows.includes(idToUnfollow)) {
        res.status(400);
        throw new Error('You are not following this user.');
    }
    
    // create an array with unfollow ID filtered out, then assign to user.
    req.user.follows = req.user.follows.filter(id => id.toString() !== idToUnfollow.toString());
    
    await req.user.save();

    res.status(201).json(req.user.follows);
});

module.exports = {
    registerUser,
    loginUser,
    getUser,
    getMe,
    followUser,
    unfollowUser,
};