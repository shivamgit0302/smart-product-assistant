import express from "express";

const router = express.Router();

// Get current session data
router.get("/", (req, res) => {
  // Initialize search history if it doesn't exist
  if (!req.session.searchHistory) {
    req.session.searchHistory = [];
  }

  res.json({
    sessionId: req.sessionID,
    searchHistory: req.session.searchHistory,
  });
});

// Clear session history
router.delete("/history", (req, res) => {
  req.session.searchHistory = [];
  res.json({ message: "Search history cleared" });
});

export default router;
