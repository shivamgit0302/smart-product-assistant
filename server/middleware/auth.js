import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Ensure JWT_SECRET is loaded from environment
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.warn(
    "WARNING: JWT_SECRET not set in environment - using default (NOT secure for production)"
  );
}

// Authentication middleware
export const authenticate = async (req, res, next) => {
  // Extract token from Authorization header first, then cookie
  const token =
    (req.headers.authorization && req.headers.authorization.split(" ")[1]) ||
    req.cookies.token;

  // Initialize empty session for all users
  req.session = { searchHistory: [], searchCache: {} };

  if (!token) {
    console.log("No authentication token - anonymous user");
    return next();
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.userId) {
      // Authenticated user - load from database
      const user = await User.findById(decoded.userId);
      if (user) {
        console.log("User authenticated:", user.name);
        req.user = user;
        req.session = {
          userId: user._id,
          searchHistory: user.searchHistory || [],
          searchCache: user.searchCache || new Map(),
        };
      }
    }
  } catch (error) {
    console.error("Token verification error:", error.message);
    // Don't return an error response, just continue as unauthenticated
  }

  next();
};

// Session saving middleware
export const saveSession = async (req, res, next) => {
  const originalEnd = res.end;

  res.end = async function (chunk, encoding) {
    if (req.user && req.session && req.session.searchHistory) {
      try {
        // Use findByIdAndUpdate for atomic updates
        await User.findByIdAndUpdate(req.user._id, {
          searchHistory: req.session.searchHistory || [],
        });
        console.log(
          `Updated search history for user ${req.user._id}, ${req.session.searchHistory.length} items`
        );
      } catch (error) {
        console.error("Session save error:", error.message);
      }
    }

    return originalEnd.call(this, chunk, encoding);
  };

  next();
};

// Improved cache update function
export const updateUserSearchCache = async (userId, query, cacheData) => {
  try {
    // Use findOneAndUpdate with $set operator for atomic updates
    const result = await User.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          [`searchCache.${query}`]: {
            aiExplanation: cacheData?.aiExplanation || "",
            timestamp: cacheData?.timestamp || Date.now(),
            recommendations:
              cacheData?.recommendations?.map((rec) => ({
                _id: rec._id?.toString() || "unknown",
                name: rec.name || "Unknown Product",
                description: rec.description || "",
                price: rec.price || 0,
                category: rec.category || "uncategorized",
                relevanceScore: rec.relevanceScore || 0,
                imageUrl: rec.imageUrl || "",
              })) || [],
          },
        },
      },
      { new: true }
    );

    console.log(`Search cache updated for query: ${query}`);
    return !!result;
  } catch (error) {
    console.error(`Failed to update search cache: ${error.message}`);
    return false;
  }
};

export default {
  authenticate,
  saveSession,
  updateUserSearchCache,
  JWT_SECRET,
};
