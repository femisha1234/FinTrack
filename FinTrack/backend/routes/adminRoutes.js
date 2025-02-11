const express = require('express');
const { registerAdmin, loginAdmin, getCurrentAdmin , getAnalytics } = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware'); 
const router = express.Router();

// Register a new admin
router.post('/register', registerAdmin);
// Login an admin
router.post('/login', loginAdmin);
// Get the current logged-in admin details
router.get('/me', authMiddleware, getCurrentAdmin);
router.get('/analytics', authMiddleware, getAnalytics);


module.exports = router;
