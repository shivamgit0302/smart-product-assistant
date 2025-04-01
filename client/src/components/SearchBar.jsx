"use client";

import { useState, useEffect, useRef } from "react";
import {
  moderateContent,
  suggestAlternatives,
} from "../utils/contentModeration";

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState([
    "lightweight laptop",
    "coffee gift",
    "running shoes",
    "noise-cancelling headphones",
    "waterproof hiking boots",
  ]);
  const inputRef = useRef(null);
  const MAX_QUERY_LENGTH = 150;

  // Focus the search input on component mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleQueryChange = (e) => {
    const newQuery = e.target.value;
    // Only update if the query is within the character limit
    if (newQuery.length <= MAX_QUERY_LENGTH) {
      setQuery(newQuery);
      // Clear any previous error when user types
      if (error) setError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!query.trim()) {
      return;
    }

    // Check if the query is appropriate
    const moderationResult = moderateContent(query);

    if (!moderationResult.isAppropriate) {
      setError(moderationResult.message);
      // Generate alternative suggestions
      setSuggestions(suggestAlternatives(query));
      return;
    }

    // If we get here, the query is appropriate
    setError("");
    onSearch(query);
  };

  // Calculate remaining characters
  const remainingChars = MAX_QUERY_LENGTH - query.length;
  const isNearLimit = remainingChars <= 20;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="relative flex rounded-full overflow-hidden shadow-lg">
          <input
            ref={inputRef}
            type="text"
            placeholder="What are you looking for? (e.g., 'lightweight laptop for college')"
            value={query}
            onChange={handleQueryChange}
            className={`flex-1 px-5 py-4 text-gray-700 bg-white border-none focus:outline-none text-lg ${
              error ? "border-red-500 bg-red-50" : ""
            }`}
            aria-label="Search products"
            maxLength={MAX_QUERY_LENGTH}
          />
          <button
            type="submit"
            className="px-3 sm:px-6 py-4 bg-[#0096c7] text-white font-medium hover:bg-[#0077b6] focus:outline-none transition-colors whitespace-nowrap disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={query.trim().length === 0}
          >
            <div className="flex items-center">
              <svg
                className="h-5 w-5 sm:mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <span className="hidden sm:inline">Search</span>
            </div>
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-2 text-amber-200 text-sm bg-red-900/30 p-2 rounded">
            <span className="font-medium">⚠️ </span>
            {error}
          </div>
        )}

        {/* Character counter */}
        {!error && query.length > 0 && (
          <div
            className={`text-right text-xs mt-2 px-2 ${
              isNearLimit ? "text-amber-200 font-medium" : "text-blue-100"
            }`}
          >
            {remainingChars} characters remaining
          </div>
        )}
      </form>

      {/* Quick suggestions - show different ones if there's an error */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => {
              setQuery(suggestion);
              setError("");
              onSearch(suggestion);
            }}
            className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-full text-sm text-white transition-colors duration-200"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SearchBar;
