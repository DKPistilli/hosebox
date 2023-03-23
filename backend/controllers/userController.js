const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');

//import collections
const User = require('../models/userModel');

// Generate JWT based off of userId
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '90d' });
}

// @ desc  Register new user
// @route  POST /api/users
// @access Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // verify req body contains necessary information
    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please add all fields (name/email/password)');
    }

    // check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // hash password for privacy
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create new user
    const user = await User.create({
        name,
        email,
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

// @ desc  Authenticate a user
// @route  POST /api/users/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // check for user email in db
    const user = await User.findOne({ email });

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

module.exports = {
    registerUser,
    loginUser,
    getUser,
    getMe,
}