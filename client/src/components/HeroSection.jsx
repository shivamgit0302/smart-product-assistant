import SearchBar from "./SearchBar";
import SearchHistory from "./SearchHistory";

function HeroSection({ onSearch, searchHistory }) {
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
          <SearchHistory history={searchHistory} onSearchAgain={onSearch} />
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
