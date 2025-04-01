"use client";

import SearchBar from "./SearchBar";
import SearchHistory from "./SearchHistory";
import { useAuth } from "../contexts/AuthContext";

function HeroSection({ onSearch, searchHistory }) {
  const { currentUser } = useAuth();

  return (
    <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-white">
            Find Exactly What You Need
          </h2>
          <p className="text-xl text-blue-50 mb-10 max-w-2xl mx-auto">
            Describe what you're looking for in your own words, and our AI will
            find the perfect products for you.
          </p>
          <SearchBar onSearch={onSearch} />

          {!currentUser && (
            <div className="mt-4 bg-blue-400/20 backdrop-blur-sm rounded-lg p-4 text-white text-sm border border-blue-300/30">
              <div className="flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white mr-2 flex-shrink-0"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <span className="font-medium">Pro tip:</span> Log in to save
                  your search history and get faster results.
                </div>
              </div>
            </div>
          )}

          {currentUser && searchHistory && searchHistory.length > 0 && (
            <SearchHistory history={searchHistory} onSearchAgain={onSearch} />
          )}
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
