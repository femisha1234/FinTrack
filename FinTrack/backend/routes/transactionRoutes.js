const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Transaction = require("../models/Transaction");
const { addTransaction, getTransactions, deleteTransaction } = require("../controllers/transactionController");

// Use the middleware for routes that require authentication
router.post("/", authMiddleware, addTransaction);  // Add transaction
router.get("/", authMiddleware, getTransactions);  // Get transactions
router.delete("/:id", authMiddleware, deleteTransaction);  // Delete transaction

// Update a transaction
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const updatedTransaction = req.body;

    try {
        const transaction = await Transaction.findByIdAndUpdate(id, updatedTransaction, { new: true });

        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        res.json(transaction);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});



module.exports = router;
