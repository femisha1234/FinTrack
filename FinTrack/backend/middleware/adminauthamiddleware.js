const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Extract token from "Bearer <token>"
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => { // Use environment variable
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.admin = decoded; // Attach admin info to request object
    next();
  });
};

module.exports = authMiddleware;
