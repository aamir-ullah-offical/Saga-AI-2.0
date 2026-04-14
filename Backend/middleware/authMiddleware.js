const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

// ✅ Middleware to protect routes
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1]; // Extract token
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token

      // Attach full user object to request (without password)
      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(401).json({ error: "User not found in DB" });
      }

      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ error: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ error: "Not authorized, no token" });
  }
});

module.exports = { protect };
