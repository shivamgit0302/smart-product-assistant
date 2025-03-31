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
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? [
            "https://your-frontend-url.vercel.app",
            "https://www.your-domain.com",
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
app.get("/", (req, res) => {
  res.send("Smart Product Assistant API is running");
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
