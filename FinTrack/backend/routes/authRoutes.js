const express = require("express");
const { register, login , getUsers  } = require("../controllers/authController");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/users", getUsers);

// Fetch Single User by ID
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // Get the user by ID attached to req.user
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user); // Send the user info without the password
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
// Update user profile
router.put('/me', authMiddleware, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Find the user by ID from the JWT token
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user fields if provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    // Save updated user information
    await user.save();

    // Respond with updated user data excluding password
    res.json({ message: 'Profile updated successfully', user: { name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Activate User
router.put('/users/:id/activate', async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, { status: 'Active' }, { new: true });
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Deactivate User
  router.put('/users/:id/deactivate', async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, { status: 'Inactive' }, { new: true });
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Delete User
  router.delete("/users/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

//block and unblock user
router.put('/users/:id/block', async (req, res) => {
  const userId = req.params.userId; // Get the user ID from the URL

  try {
      // Find the user by ID
      const user = await User.findById(userId);

      if (!user) {
          return res.status(404).json({ message: 'User not found' }); // User not found
      }

      // Block the user
      user.isBlocked = true;
      await user.save(); // Save the updated user

      // Respond with success
      res.status(200).json({ message: `User ${user.username} blocked successfully`, user });
  } catch (error) {
      console.error('Error blocking user:', error);
      res.status(500).json({ message: 'Server error', error });
  }
});


module.exports = router;
