const mongoose = require('mongoose');

const userSchema = mongoose.Schema({

    name: {
        type: String,
        required: [true, "Name required for User"]
    },

    email: {
        type: String,
        required: [true, "Email required for User"],
        unique: true
    },

    password: {
        type: String,
        required: [true, "Password required for User"]
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema)