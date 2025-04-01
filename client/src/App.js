"use client";

import { useState, useEffect } from "react";
import HeroSection from "./components/HeroSection";
import ProductList from "./components/ProductList";
import ProductDetail from "./components/ProductDetail";
import EmptyState from "./components/EmptyState";
import SortFilterControls from "./components/SortFilterControls";
import config from "./config";
import { useAuth } from "./contexts/AuthContext";
import AuthModal from "./components/AuthModal";
import { AuthProvider } from "./contexts/AuthContext";
import MetaTags from "./components/MetaTags";
// Helper function to parse AI response
function parseAIResponse(aiExplanation) {
  if (!aiExplanation) return { explanation: "", products: [] };

  const parts = aiExplanation.split(/PRODUCTS:/i);

  if (parts.length < 2) {
    return { explanation: aiExplanation.trim(), products: [] };
  }

  const explanation = parts[0].replace(/EXPLANATION:/i, "").trim();
  const productsText = parts[1].trim();

  // Parse products using regex
  const productRegex =
    /(\d+)\.\s+(.*?)\s+-\s+Relevance Score:\s+(\d+)\s+-\s+(.*?)(?=\n\d+\.|$)/gs;
  const products = [];
  let match;

  while ((match = productRegex.exec(productsText)) !== null) {
    products.push({
      number: match[1],
      name: match[2].trim(),
      relevanceScore: Number.parseInt(match[3]),
      description: match[4].trim(),
    });
  }

  return { explanation, products };
}

// AI Assistant component
function AIAssistant({ aiExplanation, fromCache }) {
  const { explanation, products } = parseAIResponse(aiExplanation);

  return (
    <div className="mb-8 bg-primary-50 border border-primary-100 rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="bg-primary-100 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="bg-primary-500 rounded-full p-2 mr-3">
            <svg
              className="h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800">AI Assistant</h2>
        </div>
        {fromCache && (
          <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full border border-gray-200">
            Cached Result
          </span>
        )}
      </div>

      {/* Explanation */}
      <div className="p-6 border-b border-primary-100">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
          EXPLANATION:
        </h3>
        <p className="text-gray-700 whitespace-pre-line leading-relaxed">
          {explanation}
        </p>
      </div>

      {/* Products */}
      {products.length > 0 && (
        <div className="p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
            PRODUCTS:
          </h3>
          <div className="space-y-4">
            {products.map((product, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start justify-between">
                  <h4 className="text-lg font-medium text-gray-900">
                    {product.number}. {product.name}
                  </h4>
                  <div className="ml-2 flex-shrink-0">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Score: {product.relevanceScore}
                    </span>
                  </div>
                </div>
                <p className="mt-2 text-gray-600">{product.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AppContent() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchResponse, setSearchResponse] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [sortOption, setSortOption] = useState("relevance");
  const [filterOptions, setFilterOptions] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const { currentUser, loading: authLoading, logout, apiWithAuth } = useAuth();

  // Apply sorting and filtering
  useEffect(() => {
    if (!products || products.length === 0) {
      setFilteredProducts([]);
      return;
    }

    let result = [...products];

    // Apply filtering
    if (filterOptions) {
      // Filter by price range
      if (
        filterOptions.priceMin !== undefined ||
        filterOptions.priceMax !== undefined
      ) {
        result = result.filter(
          (product) =>
            (filterOptions.priceMin === undefined ||
              product.price >= filterOptions.priceMin) &&
            (filterOptions.priceMax === undefined ||
              product.price <= filterOptions.priceMax)
        );
      }

      // Filter by categories
      if (filterOptions.categories && filterOptions.categories.length > 0) {
        result = result.filter((product) =>
          filterOptions.categories.includes(product.category)
        );
      }
    }

    // Apply sorting
    if (sortOption) {
      switch (sortOption) {
        case "price_asc":
          result.sort((a, b) => a.price - b.price);
          break;
        case "price_desc":
          result.sort((a, b) => b.price - a.price);
          break;
        case "name_asc":
          result.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "relevance":
        default:
          // For relevance, we use the existing order since it's already sorted by relevance
          result.sort(
            (a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0)
          );
          break;
      }
    }

    setFilteredProducts(result);
  }, [products, sortOption, filterOptions]);

  // Handler functions
  const handleSort = (option) => {
    setSortOption(option);
  };

  const handleFilter = (options) => {
    setFilterOptions(options);
  };

  // Get a list of unique categories for the filter dropdown
  const categories =
    products.length > 0
      ? [...new Set(products.map((p) => p.category))].sort()
      : [];

  // Calculate price range for filter
  const priceRange =
    products.length > 0
      ? {
          min: Math.floor(Math.min(...products.map((p) => p.price))),
          max: Math.ceil(Math.max(...products.map((p) => p.price))),
        }
      : { min: 0, max: 1000 };

  // Fetch search history when user changes
  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        if (authLoading) return;

        if (!currentUser) {
          setSearchHistory([]);
          return;
        }

        const response = await apiWithAuth(`${config.API_URL}/session`);

        if (response.ok) {
          const data = await response.json();
          setSearchHistory(data.searchHistory || []);
        }
      } catch (err) {
        console.error("Error fetching session:", err);
      }
    };

    fetchSessionData();
  }, [currentUser, authLoading, apiWithAuth]);

  const handleSearch = async (query) => {
    try {
      setLoading(true);
      setHasSearched(true);

      const response = await apiWithAuth(`${config.API_URL}/search`, {
        method: "POST",
        body: JSON.stringify({ query }),
      });

      if (!response.ok) throw new Error("Search failed");

      const data = await response.json();
      setSearchResponse(data);
      setProducts(data.recommendations || []);

      // Only update search history if we got history from server (for logged-in users)
      if (data.searchHistory && data.searchHistory.length > 0) {
        setSearchHistory(data.searchHistory);
      }

      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
  };

  const handleBackToList = () => {
    setSelectedProduct(null);
  };

  const renderUserMenu = () => {
    if (authLoading) {
      return <div className="text-gray-500">Loading...</div>;
    }

    if (currentUser) {
      return (
        <div className="flex items-center">
          <span className="mr-2 text-gray-700">Hello, {currentUser.name}</span>
          <button
            onClick={logout}
            className="text-sm text-primary-600 hover:text-primary-800"
          >
            Logout
          </button>
        </div>
      );
    }

    return (
      <button
        onClick={() => setShowAuthModal(true)}
        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
      >
        Login / Register
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">
            Smart Product Assistant
          </h1>
          {renderUserMenu()}
        </div>
      </div>
      <HeroSection onSearch={handleSearch} searchHistory={searchHistory} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-8">
        <main className="bg-white rounded-2xl shadow-soft p-6 md:p-8">
          {error && (
            <div className="mb-6 bg-accent-50 border-l-4 border-accent-500 p-4 rounded-lg text-accent-700">
              <div className="flex">
                <svg
                  className="h-6 w-6 text-accent-500 mr-3"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <p>{error}</p>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col justify-center items-center py-20">
              <div className="relative w-20 h-20">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-200 rounded-full"></div>
                <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-500 rounded-full animate-spin border-t-transparent"></div>
              </div>
              <p className="mt-6 text-gray-600 text-lg">
                Finding the perfect products for you...
              </p>
            </div>
          ) : selectedProduct ? (
            <ProductDetail
              product={selectedProduct}
              onBack={handleBackToList}
            />
          ) : hasSearched ? (
            <>
              {searchResponse && searchResponse.aiExplanation && (
                <AIAssistant
                  aiExplanation={searchResponse.aiExplanation}
                  fromCache={searchResponse.fromCache}
                />
              )}

              {/* Results count */}
              {searchResponse && (
                <div className="mb-6 flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-800">
                      {filteredProducts.length}{" "}
                      {filteredProducts.length === 1 ? "Product" : "Products"}{" "}
                      Found
                    </h2>
                  </div>

                  {products.length > 0 && (
                    <SortFilterControls
                      onSort={handleSort}
                      onFilter={handleFilter}
                      sortOption={sortOption}
                      filterOptions={filterOptions}
                      categories={categories}
                      priceRange={priceRange}
                      products={products}
                    />
                  )}
                </div>
              )}

              <ProductList
                products={
                  filteredProducts.length > 0 ? filteredProducts : products
                }
                onSelectProduct={handleProductSelect}
                hasSearched={hasSearched}
              />
            </>
          ) : (
            <EmptyState />
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-center items-center">
            <div className="mb-6 md:mb-0 text-center">
              <h2 className="text-xl font-bold text-gray-800">
                Smart Product Assistant
              </h2>
              <p className="text-gray-600 mt-2">
                Using AI to help you find exactly what you're looking for.
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Smart Product Assistant. All
              rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <MetaTags />
      <AppContent />
    </AuthProvider>
  );
}

export default App;
