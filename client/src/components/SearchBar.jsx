"use client";

import { useState, useEffect, useRef } from "react";

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  // Focus the search input on component mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form
        className="relative flex rounded-full overflow-hidden shadow-lg"
        onSubmit={handleSubmit}
      >
        <input
          ref={inputRef}
          type="text"
          placeholder="What are you looking for? (e.g., 'lightweight laptop for college')"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 px-5 py-4 text-gray-700 bg-white border-none focus:outline-none text-lg"
          aria-label="Search products"
        />
        <button
          type="submit"
          className="px-3 sm:px-6 py-4 bg-[#0096c7] text-white font-medium hover:bg-[#0077b6] focus:outline-none transition-colors whitespace-nowrap"
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
      </form>

      {/* Quick suggestions */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        {[
          "lightweight laptop",
          "coffee gift",
          "running shoes",
          "noise-cancelling headphones",
          "waterproof hiking boots",
        ].map((suggestion, index) => (
          <button
            key={index}
            onClick={() => {
              setQuery(suggestion);
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
