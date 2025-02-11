const express = require('express');
const router = express.Router();
const Goal = require('../models/Savings');
const authMiddleware = require('../middleware/authMiddleware'); // Middleware for user authentication

// Get all savings goals for the logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user.id });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching goals' });
  }
});

// Add a new savings goal
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, targetAmount, currentAmount, deadline } = req.body;

    // Validate input data
    if (!name || !targetAmount || !currentAmount || !deadline) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create a new goal instance, including userId
    const newGoal = new Goal({
      name,
      targetAmount,
      currentAmount,
      deadline,
      userId: req.user.id,  // Set the userId
    });

    // Save the goal to the database
    await newGoal.save();
    res.status(201).json(newGoal);
  } catch (error) {
    console.error("Error saving goal:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// In your backend routes (e.g., savingsRoutes.js)
router.put('/:id', async (req, res) => {
  try {
    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // To return the updated goal
    });
    if (!updatedGoal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    res.status(200).json(updatedGoal);
  } catch (error) {
    res.status(500).json({ message: 'Error updating goal', error: error.message });
  }
});

// Delete a savings goal
// In your backend routes (e.g., savingsRoutes.js)
router.delete('/:id', async (req, res) => {
  try {
    const deletedGoal = await Goal.findByIdAndDelete(req.params.id);
    if (!deletedGoal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    res.status(200).json({ message: 'Goal deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting goal', error: error.message });
  }
});


module.exports = router;