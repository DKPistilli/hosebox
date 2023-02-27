const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');

//import collections
const User      = require('../models/userModel');
const Inventory = require('../models/inventoryModel');

// Generate JWT based off of userId
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '60d' });
}

// @ desc  Register new user and create new associated empty inventory
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
        password: hashedPassword
    });

    if (user) {

        //create new empty inventory associated w user
        const inventory = await Inventory.create({
            user: user.id,
        });

        const updatedUser = await User.findByIdAndUpdate(user.id, {inventory: inventory.id}, {new:true});

        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
            inventory: inventory.id,
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

// @ desc  Get user data
// @route  GET /api/users/me
// @access Private
const getMe = asyncHandler(async (req, res) => {
    res.status(200).json(req.user);
});

module.exports = {
    registerUser,
    loginUser,
    getMe
}