const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Transaction=require('../models/Transaction')

// Register a new admin
exports.registerAdmin = async (req, res) => {
    try {
        const { email, password  } = req.body;

        // Check if admin already exists
        let admin = await Admin.findOne({ email });
        if (admin) {
            return res.status(400).json({ msg: 'Admin already exists' });
        }

        // Create new admin
        admin = new Admin({
            email,
            password,
            
        });

        // Hash password before saving
        await admin.save();

        // Generate JWT token
        const token = jwt.sign({ admin: { id: admin._id } }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({
            msg: 'Admin registered successfully',
            token,
            adminId: admin._id,
        });
    } catch (error) {
        console.error('Error registering admin:', error);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Login an admin
exports.loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find admin by email
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Compare password
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ admin: { id: admin._id } }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({
            token,
            adminId: admin._id,
            role: admin.role,
        });
    } catch (error) {
        console.error('Error logging in admin:', error);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Get the current logged-in admin details
exports.getCurrentAdmin = async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin.id).select('-password');
        if (!admin) {
            return res.status(404).json({ msg: 'Admin not found' });
        }
        res.json(admin);
    } catch (error) {
        console.error('Error fetching admin:', error);
        res.status(500).json({ msg: 'Server error' });
    }
};
exports.getAnalytics = async (req, res) => {
    try {
        // Aggregate total income
        const totalIncome = await Transaction.aggregate([
            { $match: { type: 'income' } },
            { $group: { _id: null, totalIncome: { $sum: "$amount" } } }
        ]);

        // Aggregate total expense
        const totalExpense = await Transaction.aggregate([
            { $match: { type: 'expense' } },
            { $group: { _id: null, totalExpense: { $sum: "$amount" } } }
        ]);

        // Get recent transactions (latest 10)
        const recentTransactions = await Transaction.find().sort({ date: -1 }).limit(10);

        // Send the response with totals and recent transactions
        res.json({
            totalIncome: totalIncome.length > 0 ? totalIncome[0].totalIncome : 0,
            totalExpense: totalExpense.length > 0 ? totalExpense[0].totalExpense : 0,
            transactions: recentTransactions || [] // Ensure transactions is always an array
        });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
