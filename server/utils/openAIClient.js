import OpenAI from "openai";

// Try to load dotenv for local development (won't error in production)
try {
  // Dynamic import since this is only needed in development
  const { default: dotenv } = await import("dotenv");
  dotenv.config();
} catch (error) {
  // In production (like Vercel), this isn't needed
  console.log("Skipping dotenv config (likely in production)");
}

// Get API key from environment (works in both local and Vercel)
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.error("OpenAI API key not found in environment variables!");
  // In production, we might want to handle this more gracefully
  // process.exit(1);
}

// Create a singleton instance
const openai = new OpenAI({
  apiKey: apiKey,
});

export default openai;
