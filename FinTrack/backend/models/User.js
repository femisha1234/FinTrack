const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    settings: {
        theme: { type: String, default: 'light' },
        currency: { type: String, default: 'USD' },
        notifications: {
            email: { type: Boolean, default: true },
            alerts: { type: Boolean, default: true }
        }
    },
},

    { timestamps: true }
)

module.exports = mongoose.model('User', UserSchema)