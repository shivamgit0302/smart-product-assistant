import express from "express";
import User from "../models/User.js"; // Import the User model

const router = express.Router();

// Get current session data
router.get("/", (req, res) => {
  // Check if user is authenticated
  const isAuthenticated = !!req.user;

  res.json({
    isAuthenticated,
    user: isAuthenticated
      ? {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
        }
      : null,
    // Only return search history for logged-in users
    searchHistory: isAuthenticated ? req.session.searchHistory || [] : [],
  });
});

// Clear session history
router.delete("/history", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    // Clear history in session
    req.session.searchHistory = [];

    // Clear history in database
    await User.findByIdAndUpdate(req.user._id, { searchHistory: [] });

    res.json({ message: "Search history cleared" });
  } catch (error) {
    console.error("Error clearing history:", error);
    res.status(500).json({ message: "Failed to clear history" });
  }
});

export default router;
