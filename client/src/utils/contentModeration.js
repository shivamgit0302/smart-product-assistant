// List of terms that might indicate inappropriate content
const INAPPROPRIATE_TERMS = [
  // Violence
  "kill",
  "murder",
  "attack",
  "bomb",
  "weapon",
  "gun",
  "shoot",
  "assault",
  "violence",

  // Hate speech
  "nazi",
  "racist",
  "terrorism",
  "terrorist",
  "hate",
  "racial slur",

  // Adult content indicators
  "porn",
  "xxx",
  "sex",
  "nude",
  "naked",

  // Illegal activities
  "hack",
  "steal",
  "illegal drug",
  "cocaine",
  "heroin",
];

// List of terms that might indicate off-topic or non-product queries
const OFF_TOPIC_INDICATORS = [
  "who is",
  "what is the meaning of life",
  "tell me about",
  "explain",
  "how to make",
  "recipe for",
  "directions to",
  "weather in",
  "translate",
  "calculate",
  "solve",
  "what time",
  "when will",
];

/**
 * Checks if a query contains inappropriate content
 * @param {string} query - The search query to check
 * @returns {Object} - Result with status and message
 */
export function moderateContent(query) {
  if (!query || typeof query !== "string") {
    return {
      isAppropriate: false,
      message: "Please enter a valid search query.",
    };
  }

  const queryLower = query.toLowerCase();

  // Check for inappropriate terms
  for (const term of INAPPROPRIATE_TERMS) {
    if (queryLower.includes(term)) {
      return {
        isAppropriate: false,
        message:
          "Your search contains terms that may violate our content policy. Please try a different search.",
      };
    }
  }

  // Check if query is too short
  if (queryLower.length < 3) {
    return {
      isAppropriate: false,
      message: "Please enter a more specific search query.",
    };
  }

  // Check if query is likely off-topic
  for (const indicator of OFF_TOPIC_INDICATORS) {
    if (queryLower.startsWith(indicator)) {
      return {
        isAppropriate: false,
        message:
          "Please enter a product-related search query. For example, 'lightweight laptop' or 'running shoes for beginners'.",
      };
    }
  }

  // Check if query is too generic
  if (
    ["a", "the", "this", "that", "it", "product", "item", "thing"].includes(
      queryLower
    )
  ) {
    return {
      isAppropriate: false,
      message: "Please be more specific about what you're looking for.",
    };
  }

  return {
    isAppropriate: true,
    message: "",
  };
}

/**
 * Suggests alternative queries for inappropriate content
 * @param {string} query - The original query
 * @returns {string[]} - Array of suggested alternative queries
 */
export function suggestAlternatives(query) {
  const queryLower = query.toLowerCase();

  // Default suggestions
  const defaultSuggestions = [
    "lightweight laptop",
    "wireless headphones",
    "running shoes",
    "coffee maker",
    "smartphone accessories",
  ];

  // If query is too short or generic, just return defaults
  if (queryLower.length < 3) {
    return defaultSuggestions;
  }

  // Try to extract potentially valid terms from the query
  const words = queryLower.split(/\s+/);
  const validWords = words.filter(
    (word) =>
      word.length > 3 &&
      !INAPPROPRIATE_TERMS.some((term) => word.includes(term))
  );

  if (validWords.length === 0) {
    return defaultSuggestions;
  }

  // Generate contextual suggestions based on valid words
  const contextualSuggestions = [];

  // Product categories that might be relevant
  const categories = [
    "electronics",
    "clothing",
    "home",
    "kitchen",
    "office",
    "sports",
    "outdoors",
    "beauty",
    "books",
    "toys",
  ];

  // Generate a few contextual suggestions
  for (let i = 0; i < Math.min(3, validWords.length); i++) {
    const word = validWords[i];
    const randomCategory =
      categories[Math.floor(Math.random() * categories.length)];
    contextualSuggestions.push(`${randomCategory} ${word}`);
    contextualSuggestions.push(`${word} for home`);
  }

  // Combine with some defaults to ensure we have enough suggestions
  return [...new Set([...contextualSuggestions, ...defaultSuggestions])].slice(
    0,
    5
  );
}
