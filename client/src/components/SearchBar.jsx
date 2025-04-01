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
  const [isFocused, setIsFocused] = useState(false);
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
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={`relative flex rounded-full overflow-hidden shadow-lg transition-all duration-200 ${
            isFocused ? "shadow-blue-400/30 ring-2 ring-white/50" : ""
          }`}
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="What are you looking for?"
            value={query}
            onChange={handleQueryChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`flex-1 px-5 py-4 text-gray-700 bg-white/90 border-none focus:outline-none text-lg ${
              error ? "border-red-500 bg-red-50" : ""
            }`}
            aria-label="Search products"
            maxLength={MAX_QUERY_LENGTH}
          />
          <button
            type="submit"
            className="px-5 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium hover:from-blue-700 hover:to-cyan-700 focus:outline-none transition-all duration-200 whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500"
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
          <div className="mt-3 text-white text-sm bg-red-500/80 p-3 rounded-lg shadow-lg">
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
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm text-white transition-all duration-200 shadow-sm hover:shadow border border-white/10"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SearchBar;
