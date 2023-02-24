const mongoose = require('mongoose');

const goalSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "User required for goal"],
            ref: 'User'
        },
        
        text: {
            type: String,
        }
    },
    
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Goal', goalSchema);