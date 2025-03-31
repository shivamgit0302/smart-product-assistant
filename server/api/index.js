import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import session from "express-session";
import productsRoutes from "../routes/products.js";
import searchRoutes from "../routes/search.js";
import sessionRoutes from "../routes/session.js";

dotenv.config();

// Initialize Express
const app = express();

// Middleware
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "*" // For now allow all origins - tighten this later
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

// Root API route
app.get("/api", (req, res) => {
  res.json({ message: "Smart Product Assistant API is running" });
});

// Connect to MongoDB once
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

// Handler for serverless function
export default async function handler(req, res) {
  // Connect to MongoDB
  await connectDB();

  // Let express handle the request
  return new Promise((resolve, reject) => {
    app(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}
