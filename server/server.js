import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import session from "express-session";
import productsRoutes from "./routes/products.js";
import searchRoutes from "./routes/search.js";
import sessionRoutes from "./routes/session.js";

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? [
            "https://frontend-smart-product-assistant.vercel.app", // Update this with your actual frontend URL after deployment
            "https://www.frontend-smart-product-assistant.vercel.app",
          ]
        : "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "smart-product-assistant-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Routes
app.use("/api/products", productsRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/session", sessionRoutes);

// Root route
app.get("/api", (req, res) => {
  res.json({ message: "Smart Product Assistant API is running" });
});

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ status: "API is running" });
});

// Connect to MongoDB
if (process.env.MONGODB_URI) {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));
}

// Only start the server if we're not being imported by Vercel
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export the Express app for Vercel
export default app;