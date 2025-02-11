const Transaction = require("../models/Transaction");

// Add Transaction (Income or Expense)
exports.addTransaction = async (req, res) => {
  try {
    console.log("User from request:", req.user); // Debugging log
    console.log("Received transaction data:", req.body);

    const { amount, type, category, date, source } = req.body;

    // Validate the date format (e.g., YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!date.match(dateRegex)) {
      return res.status(400).json({ message: "Invalid date format. Use YYYY-MM-DD." });
    }
    
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized: No user found" });
    }

    const newTransaction = new Transaction({
      userId: req.user.id, // Ensure user ID is set
      amount,
      type, // 'income' or 'expense'
      category,
      date: new Date(date), // Ensure the date is stored as a Date object
      source
  });
  

    const savedTransaction = await newTransaction.save();
    console.log("Transaction saved:", savedTransaction);
    res.status(201).json(savedTransaction);
  } catch (err) {
      console.error("Error adding transaction:", err); // Log actual error
      res.status(500).json({ message: "Error adding transaction", error: err.message });
  }
};


  // Delete Transaction
exports.deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        await Transaction.findByIdAndDelete(id);
        res.status(200).json({ msg: "Transaction deleted successfully" });
    } catch (error) {
        res.status(500).json({ msg: "Error deleting transaction" });
    }
};

// Get Transactions
exports.getTransactions = async (req, res) => {
  try {
    if (!req.user) {
      console.error("Unauthorized: No user found.");
      return res.status(401).json({ message: "Unauthorized: No user found" });
    }

    // Fetch all transactions for the logged-in user (both income and expense)
    const transactions = await Transaction.find({ userId: req.user.id });
    const formattedTransactions = transactions.map((t) => ({
      ...t._doc,
      date: t.date.toISOString().split("T")[0], // Ensure date format is YYYY-MM-DD
    }));

    // Filter income and expense transactions separately
    const incomeTransactions = transactions.filter(txn => txn.type === "income");
    const expenseTransactions = transactions.filter(txn => txn.type === "expense");

    // Return both arrays in a structured object
    res.json({
      incomeTransactions,
      expenseTransactions,
      formattedTransactions 
    });
  } catch (err) {
    console.error("Error fetching transactions:", err);
    res.status(500).json({ message: "Error fetching transactions", error: err.message });
  }
};
