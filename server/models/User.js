import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Define a schema for the recommendations in the cache
const recommendationSchema = new mongoose.Schema(
  {
    _id: String,
    name: String,
    description: String,
    price: Number,
    category: String,
    relevanceScore: Number,
    imageUrl: String, // Added imageUrl field
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    searchHistory: [
      {
        query: String,
        timestamp: Date,
        numResults: Number,
      },
    ],
    // Use a regular object instead of Map for better compatibility
    // Each entry will follow the structure defined in our code, no need for a separate schema
    searchCache: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to validate password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Helper method to get a cache entry
userSchema.methods.getCacheEntry = function (query) {
  return this.searchCache && this.searchCache[query];
};

// Helper method to set a cache entry
userSchema.methods.setCacheEntry = function (query, data) {
  if (!this.searchCache) {
    this.searchCache = {};
  }
  this.searchCache[query] = data;
  return this;
};

const User = mongoose.model("User", userSchema);

export default User;
