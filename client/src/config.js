// Base URL for API requests
const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://your-vercel-deployment-url.vercel.app/api"
    : "http://localhost:5000/api";

const config = { API_URL };

export default config;
