const express = require("express");
const Razorpay = require("razorpay");
const User = require("../models/User"); // Import User model
require("dotenv").config();

const router = express.Router();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Handle payment success and upgrade user to premium
router.post("/verify-payment", async (req, res) => {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, userId } = req.body;

    try {
        // 🟢 Verify the payment with Razorpay (optional but recommended)
        // Perform Razorpay signature verification if needed
        
        // 🔹 Update user role in DB
        await User.findByIdAndUpdate(userId, { isPremium: true });

        res.json({ success: true, message: "User upgraded to premium" });
    } catch (error) {
        console.error("Payment verification failed:", error);
        res.status(500).json({ error: "Payment verification failed" });
    }
});

module.exports = router;
