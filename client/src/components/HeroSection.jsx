"use client";

import SearchBar from "./SearchBar";
import SearchHistory from "./SearchHistory";
import { useAuth } from "../contexts/AuthContext";

function HeroSection({ onSearch, searchHistory }) {
  const { currentUser } = useAuth();

  return (
    <div className="bg-gradient-to-r from-[#0077b6] to-[#0096c7] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Find Exactly What You Need
          </h1>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Describe what you're looking for in your own words, and our AI will
            find the perfect products for you.
          </p>
          <SearchBar onSearch={onSearch} />

          {!currentUser && (
            <div className="mt-4 bg-blue-800 bg-opacity-30 rounded-lg p-3 text-blue-100 text-sm">
              <span className="font-medium">💡 Pro tip:</span> Log in to save
              your search history and get faster results from cached searches.
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
