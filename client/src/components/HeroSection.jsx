import SearchBar from "./SearchBar";
import SearchHistory from "./SearchHistory";
import { useAuth } from "../contexts/AuthContext";

function HeroSection({ onSearch, searchHistory }) {
  const { currentUser } = useAuth();

  return (
    <div className="relative overflow-hidden">
      {/* Background with gradient and pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-500 opacity-90"></div>
      <div
        className="absolute inset-0 bg-grid-white/[0.05]"
        style={{ backgroundSize: "32px 32px" }}
      ></div>

      {/* Decorative circles */}
      <div className="absolute top-1/4 -left-24 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-1/3 -right-24 w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-white drop-shadow-sm">
            Find Exactly What You Need
          </h2>
          <p className="text-xl text-blue-50 mb-10 max-w-2xl mx-auto">
            Describe what you're looking for in your own words, and our AI will
            find the perfect products for you.
          </p>
          <SearchBar onSearch={onSearch} />

          {!currentUser && (
            <div className="mt-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-blue-50 text-sm shadow-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-blue-200"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="font-medium text-blue-100">Pro tip</h3>
                  <p className="mt-1">
                    Log in to save your search history and get faster results
                    from cached searches.
                  </p>
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
