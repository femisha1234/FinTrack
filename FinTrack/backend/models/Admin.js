const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Admin Schema
const AdminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'superadmin'], // You can expand this with different roles if necessary
        default: 'admin',
    },
    // You can add more fields like name, last login, etc.
}, { timestamps: true });

// Hash password before saving to database
AdminSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

// Method to compare password (for login)
AdminSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

const Admin = mongoose.model('Admin', AdminSchema);

module.exports = Admin;
