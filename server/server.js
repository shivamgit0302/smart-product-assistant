import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import productsRoutes from "./routes/products.js";
import searchRoutes from "./routes/search.js";
import sessionRoutes from "./routes/session.js";
import authRoutes from "./routes/auth.js";
import { authenticate, saveSession } from "./middleware/auth.js";
dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? [
            "https://frontend-smart-product-assistant.vercel.app",
            "https://www.frontend-smart-product-assistant.vercel.app",
          ]
        : "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Apply authentication middleware
app.use(authenticate);

// Apply session saving middleware
app.use(saveSession);
// Routes
app.use("/api/auth", authRoutes);
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