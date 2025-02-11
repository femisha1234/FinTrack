const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Assuming you have a User model

// Fetch user settings
router.get('/api/user/settings', async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you have user authentication
    const user = await User.findById(userId);
    res.json(user.settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Update user settings
router.put('/api/user/settings', async (req, res) => {
  try {
    const userId = req.user.id;
    const updatedSettings = req.body;
    await User.findByIdAndUpdate(userId, { settings: updatedSettings });
    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

module.exports = router;