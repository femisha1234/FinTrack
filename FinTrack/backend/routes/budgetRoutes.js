const express = require("express");
const router = express.Router();
const Budget = require("../models/Budget");
const authMiddleware = require("../middleware/authMiddleware"); // Ensure authentication

// Get transactions for the logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const transactions = await Budget.find({ userId: req.user.id }); // Filter by user ID
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching transactions", error: error.message });
  }
});

module.exports = router;

// Add a new transaction
router.post("/", async (req, res) => {
  const { type, amount, description } = req.body;

  if (!type || !amount || !description) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newTransaction = new Budget({ type, amount, description });
    const savedTransaction = await newTransaction.save();
    res.status(201).json(savedTransaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a transaction
router.delete("/:id", async (req, res) => {
  try {
    const deletedTransaction = await Budget.findByIdAndDelete(req.params.id);
    if (!deletedTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
