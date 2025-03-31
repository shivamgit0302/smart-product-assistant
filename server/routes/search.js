import express from "express";
import openai from "../utils/openAIClient.js";
import Product from "../models/Product.js";

const router = express.Router();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour cache
const MAX_RETRIES = 2;
const BASE_DELAY = 1000; // 1 second initial delay

// Simple token counter to estimate API usage
function approximateTokenCount(text) {
  // Rough approximation: 1 token ≈ 4 characters in English
  return Math.ceil(text.length / 4);
}

// Rate limiting tracking
let requestTimestamps = [];
const MAX_REQUESTS_PER_MINUTE = 45; // Adjust based on your API tier
let dailyTokensUsed = 0;

// Helper function to check if we're approaching rate limits
function isRateLimitApproaching() {
  // Clean up old timestamps (older than 1 minute)
  const now = Date.now();
  requestTimestamps = requestTimestamps.filter((ts) => now - ts < 60000);

  // Check if we're close to the per-minute limit
  return requestTimestamps.length >= MAX_REQUESTS_PER_MINUTE - 5; // Buffer of 5 requests
}

// Helper function for fallback search when OpenAI fails
function fallbackSearch(query, products) {
  // Convert query to lowercase for case-insensitive matching
  const queryLower = query.toLowerCase();

  // Define common keywords and their related product attributes
  const keywords = {
    laptop: ["laptop", "macbook", "computer", "notebook", "chromebook"],
    coffee: ["coffee", "barista", "espresso", "brew", "cafe"],
    lightweight: ["lightweight", "thin", "portable", "light", "slim"],
    college: [
      "college",
      "student",
      "study",
      "university",
      "school",
      "education",
    ],
    office: ["office", "work", "professional", "business", "desk"],
    headphones: [
      "headphones",
      "audio",
      "sound",
      "music",
      "earphones",
      "earbuds",
    ],
    kitchen: ["kitchen", "cooking", "chef", "baking", "culinary"],
    gift: ["gift", "present", "birthday", "holiday", "celebration"],
    gaming: ["gaming", "game", "play", "entertainment"],
    fitness: ["fitness", "workout", "exercise", "health", "gym"],
    travel: ["travel", "trip", "journey", "vacation", "portable"],
    budget: ["budget", "affordable", "cheap", "inexpensive", "value"],
    premium: ["premium", "luxury", "high-end", "quality", "professional"],
  };

  // Extract matched keywords from query
  const matchedKeywords = Object.keys(keywords).filter(
    (key) =>
      queryLower.includes(key) ||
      keywords[key].some((synonym) => queryLower.includes(synonym))
  );

  // Score products based on keyword matches
  const scoredProducts = products.map((product) => {
    let score = 0;
    const productText =
      product.name.toLowerCase() +
      " " +
      product.description.toLowerCase() +
      " " +
      product.category.toLowerCase();

    // Price-based scoring
    if (
      queryLower.includes("affordable") ||
      queryLower.includes("cheap") ||
      queryLower.includes("budget")
    ) {
      // Lower priced items get higher scores for budget queries
      score += Math.max(0, 50 - product.price / 10);
    }

    if (
      queryLower.includes("premium") ||
      queryLower.includes("high-end") ||
      queryLower.includes("quality")
    ) {
      // Higher priced items get higher scores for premium queries
      score += Math.min(50, product.price / 10);
    }

    // Increase score for each keyword match
    matchedKeywords.forEach((keyword) => {
      if (productText.includes(keyword)) score += 30;

      // Check for synonym matches
      keywords[keyword].forEach((synonym) => {
        if (productText.includes(synonym)) score += 20;
      });
    });

    // Category match bonus
    if (
      matchedKeywords.some((keyword) =>
        product.category.toLowerCase().includes(keyword)
      )
    ) {
      score += 15;
    }

    // Name match bonus (biggest impact)
    if (
      matchedKeywords.some((keyword) =>
        product.name.toLowerCase().includes(keyword)
      )
    ) {
      score += 40;
    }

    // Check attributes for matches
    if (product.attributes) {
      if (product.attributes.features) {
        product.attributes.features.forEach((feature) => {
          matchedKeywords.forEach((keyword) => {
            if (feature.toLowerCase().includes(keyword)) {
              score += 10;
            }
            keywords[keyword].forEach((synonym) => {
              if (feature.toLowerCase().includes(synonym)) {
                score += 5;
              }
            });
          });
        });
      }
    }

    return {
      ...product.toObject(),
      relevanceScore: Math.min(100, score), // Cap at 100
    };
  });

  // Filter out products with zero relevance and sort by score
  const recommendedProducts = scoredProducts
    .filter((p) => p.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore);

  // Generate a simple explanation
  const explanation = `I searched for products related to "${query}" and found ${
    recommendedProducts.length
  } relevant items. These are ranked based on how well they match your search criteria.${
    matchedKeywords.length > 0
      ? ` I focused on these key aspects: ${matchedKeywords.join(", ")}.`
      : ""
  }`;

  return {
    recommendedProducts,
    explanation,
  };
}

// Exponential backoff retry function
async function retryWithBackoff(apiCallFn, maxRetries = MAX_RETRIES) {
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const delay = BASE_DELAY * Math.pow(2, retries);
      console.log(
        `Retrying API call after ${delay}ms delay... (Attempt ${
          retries + 1
        }/${maxRetries})`
      );

      // Wait for the backoff period
      await new Promise((resolve) => setTimeout(resolve, delay));

      // Try the API call again
      return await apiCallFn();
    } catch (error) {
      retries++;
      if (retries >= maxRetries) {
        throw error; // Re-throw if we've exhausted retries
      }

      // If it's not a rate limit error, don't retry
      if (error.status !== 429) {
        throw error;
      }
    }
  }
}

// Natural language search endpoint
router.post("/", async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Initialize session structures if they don't exist
    if (!req.session.searchHistory) {
      req.session.searchHistory = [];
    }
    if (!req.session.searchCache) {
      req.session.searchCache = {};
    }

    // Check if we have a cached result for this query that isn't too old
    const cachedResult = req.session.searchCache[query];
    const currentTime = new Date().getTime();

    if (cachedResult && currentTime - cachedResult.timestamp < CACHE_TTL) {
      console.log("Using cached search results for query:", query);

      // Update the timestamp in search history for this query
      const existingHistoryIndex = req.session.searchHistory.findIndex(
        (item) => item.query === query
      );

      if (existingHistoryIndex !== -1) {
        // Move to top of history
        const existingItem = req.session.searchHistory.splice(
          existingHistoryIndex,
          1
        )[0];
        existingItem.timestamp = new Date();
        req.session.searchHistory.unshift(existingItem);
      } else {
        // Add to history if somehow not there
        req.session.searchHistory.unshift({
          query,
          timestamp: new Date(),
          numResults: cachedResult.recommendations.length,
        });
      }

      // Limit history size
      if (req.session.searchHistory.length > 10) {
        req.session.searchHistory = req.session.searchHistory.slice(0, 10);
      }

      // Return cached results
      return res.json({
        query,
        aiExplanation: cachedResult.aiExplanation,
        recommendations: cachedResult.recommendations,
        searchHistory: req.session.searchHistory,
        fromCache: true,
      });
    }

    // Check if we're approaching rate limits
    if (isRateLimitApproaching()) {
      console.log("Approaching rate limits, using fallback search");
      const products = await Product.find();
      const { recommendedProducts, explanation } = fallbackSearch(
        query,
        products
      );

      return res.json({
        query,
        aiExplanation:
          explanation +
          "\n\n(This response was generated by our fallback system because we're currently experiencing high demand.)",
        recommendations: recommendedProducts,
        searchHistory: req.session.searchHistory,
        fromFallback: true,
      });
    }

    // Fetch all products
    const products = await Product.find();

    // Create simplified product data to reduce token usage
    const productData = products.map((p) => ({
      id: p._id,
      name: p.name,
      description:
        p.description.length > 200
          ? p.description.substring(0, 200) + "..."
          : p.description,
      price: p.price,
      category: p.category,
      attributes: p.attributes,
    }));

    // Estimate token usage
    const requestContent = `User query: "${query}"\n\nProduct catalog:\n${JSON.stringify(
      productData
    )}`;
    const estimatedTokens = approximateTokenCount(requestContent);
    console.log(`Estimated token usage: ${estimatedTokens}`);

    // Check if we need to further optimize token usage
    const simplifiedProductData =
      estimatedTokens > 3000
        ? products.map((p) => ({
            id: p._id,
            name: p.name,
            description: p.description.substring(0, 100) + "...",
            price: p.price,
            category: p.category,
          }))
        : productData;

    try {
      // Track API request
      requestTimestamps.push(Date.now());

      // Define the API call function
      const makeOpenAIRequest = async () => {
        return await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `You are a product recommendation assistant. Based on the user's query, 
                     recommend the most suitable products from the catalog and explain why each 
                     product matches their needs. Assign a relevance score (1-100) to each recommended product.
                     Format your response as follows:
                     
                     EXPLANATION: A brief explanation of how you understood the user's query
                     
                     PRODUCTS:
                     1. Product Name 1 - Relevance Score: XX - Brief reason for recommendation
                     2. Product Name 2 - Relevance Score: XX - Brief reason for recommendation
                     ...and so on`,
            },
            {
              role: "user",
              content: `User query: "${query}"\n\nProduct catalog:\n${JSON.stringify(
                simplifiedProductData
              )}`,
            },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        });
      };

      // Make API call with retry capability
      let completion;
      try {
        completion = await makeOpenAIRequest();
      } catch (initialError) {
        // Check if it's a rate limit error
        if (initialError.status === 429) {
          console.log("Rate limit exceeded, implementing exponential backoff");
          completion = await retryWithBackoff(makeOpenAIRequest);
        } else {
          throw initialError;
        }
      }

      const aiResponse = completion.choices[0].message.content;

      // Track token usage
      if (completion.usage) {
        dailyTokensUsed += completion.usage.total_tokens;
        console.log(
          `Total tokens used: ${completion.usage.total_tokens}, Daily total: ${dailyTokensUsed}`
        );
      }

      // Process OpenAI response
      const processedProducts = products
        .map((product) => {
          const regex = new RegExp(
            `${product.name}.*?Relevance Score: (\\d+)`,
            "i"
          );
          const match = aiResponse.match(regex);

          let relevanceScore = 0;
          if (match && match[1]) {
            relevanceScore = parseInt(match[1]);
          }

          return {
            ...product.toObject(),
            relevanceScore: relevanceScore,
          };
        })
        .filter((p) => p.relevanceScore > 0)
        .sort((a, b) => b.relevanceScore - a.relevanceScore);

      // Cache the results
      req.session.searchCache[query] = {
        aiExplanation: aiResponse,
        recommendations: processedProducts,
        timestamp: currentTime,
      };

      // Update search history
      const existingHistoryIndex = req.session.searchHistory.findIndex(
        (item) => item.query === query
      );

      if (existingHistoryIndex !== -1) {
        // Update existing history item
        req.session.searchHistory.splice(existingHistoryIndex, 1);
      }

      // Add to the beginning of history
      req.session.searchHistory.unshift({
        query,
        timestamp: new Date(),
        numResults: processedProducts.length,
      });

      // Limit history size
      if (req.session.searchHistory.length > 10) {
        req.session.searchHistory = req.session.searchHistory.slice(0, 10);
      }

      res.json({
        query,
        aiExplanation: aiResponse,
        recommendations: processedProducts,
        searchHistory: req.session.searchHistory,
      });
    } catch (openaiError) {
      console.error("OpenAI API error:", openaiError);

      let errorType = "unknown";
      if (openaiError.status === 429) errorType = "rate_limit";
      if (openaiError.status === 403) errorType = "authentication";
      if (openaiError.status === 400) errorType = "invalid_request";

      console.log(`Error type: ${errorType}, falling back to keyword search`);

      // Fallback to keyword-based search
      const { recommendedProducts, explanation } = fallbackSearch(
        query,
        products
      );

      // Add fallback search to history
      const existingHistoryIndex = req.session.searchHistory.findIndex(
        (item) => item.query === query
      );

      if (existingHistoryIndex !== -1) {
        req.session.searchHistory.splice(existingHistoryIndex, 1);
      }

      req.session.searchHistory.unshift({
        query,
        timestamp: new Date(),
        numResults: recommendedProducts.length,
      });

      if (req.session.searchHistory.length > 10) {
        req.session.searchHistory = req.session.searchHistory.slice(0, 10);
      }

      // Create a user-friendly error message
      let userMessage = "";
      if (errorType === "rate_limit") {
        userMessage =
          "\n\n(This response was generated by our backup system because our AI service is currently experiencing high demand. Please try again in a few minutes.)";
      } else if (errorType === "authentication") {
        userMessage =
          "\n\n(This response was generated by our backup system because of an API authentication issue. Our team has been notified.)";
      } else {
        userMessage =
          "\n\n(This response was generated by our backup system because the AI service is temporarily unavailable.)";
      }

      res.json({
        query,
        aiExplanation: explanation + userMessage,
        recommendations: recommendedProducts,
        searchHistory: req.session.searchHistory,
        fromFallback: true,
        errorType,
      });
    }
  } catch (error) {
    console.error("Search error:", error);
    res
      .status(500)
      .json({ message: "Error processing search query", error: error.message });
  }
});

export default router;