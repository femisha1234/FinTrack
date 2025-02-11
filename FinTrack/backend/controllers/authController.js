const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Updated backend register method
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: "User already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({ name, email, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // Send token and success message
        res.status(201).json({ msg: "User registered successfully", token });
    } catch (err) {
        res.status(500).send("Server error");
    }
};

exports.login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { user: { id: user._id } }, // Make sure this matches how it's extracted in middleware
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({
            token,
            userId: user._id, 
        });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Fetch all users (for admin)
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password"); // Exclude passwords
        res.json(users);
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ message: "Server error" });
    }
};

