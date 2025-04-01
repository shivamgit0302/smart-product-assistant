import { useState, useRef, useEffect } from "react";

function SortFilterControls({
  onSort,
  onFilter,
  sortOption,
  filterOptions,
  categories,
  products,
  priceRange,
}) {
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const sortRef = useRef(null);
  const filterRef = useRef(null);

  // Calculate min and max price from products if not provided
  const calculatedPriceRange =
    priceRange ||
    (() => {
      if (!products || products.length === 0) return { min: 0, max: 1000 };
      const prices = products.map((p) => p.price);
      return {
        min: Math.floor(Math.min(...prices)),
        max: Math.ceil(Math.max(...prices)),
      };
    })();

  const [localFilterOptions, setLocalFilterOptions] = useState(
    filterOptions || {
      priceMin: calculatedPriceRange.min,
      priceMax: calculatedPriceRange.max,
      categories: [],
    }
  );

  useEffect(() => {
    // Close dropdowns when clicking outside
    const handleClickOutside = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setShowSortDropdown(false);
      }
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilterDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close other dropdown when one is opened
  useEffect(() => {
    if (showSortDropdown) {
      setShowFilterDropdown(false);
    }
  }, [showSortDropdown]);

  useEffect(() => {
    if (showFilterDropdown) {
      setShowSortDropdown(false);
    }
  }, [showFilterDropdown]);

  const handleApplyFilters = () => {
    onFilter(localFilterOptions);
    setShowFilterDropdown(false);
  };

  const handleCategoryChange = (category) => {
    setLocalFilterOptions((prev) => {
      const newCategories = prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category];

      return { ...prev, categories: newCategories };
    });
  };

  const handlePriceChange = (type, value) => {
    setLocalFilterOptions((prev) => ({
      ...prev,
      [type]: Number(value),
    }));
  };

  const sortOptions = [
    { value: "relevance", label: "Relevance" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
    { value: "name_asc", label: "Name: A to Z" },
  ];

  // Get unique categories from products
  const availableCategories =
    categories ||
    (products ? [...new Set(products.map((p) => p.category))].sort() : []);

  return (
    <div className="flex justify-end space-x-2">
      {/* Sort Button */}
      <div className="relative" ref={sortRef}>
        <button
          className="rounded-lg border border-gray-200 px-3 py-2 bg-white shadow-sm hover:bg-gray-50 transition-colors flex items-center"
          onClick={() => setShowSortDropdown(!showSortDropdown)}
          aria-label="Sort products"
        >
          <svg
            className="h-5 w-5 text-gray-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
            />
          </svg>
          <span className="ml-2 hidden sm:inline text-sm font-medium">
            Sort
          </span>
          {sortOption && (
            <span className="ml-1 text-primary-600 hidden sm:inline">
              •{" "}
              {sortOptions.find((opt) => opt.value === sortOption)?.label || ""}
            </span>
          )}
        </button>

        {showSortDropdown && (
          <div className="fixed inset-0 z-40 sm:relative sm:inset-auto">
            <div
              className="absolute inset-0 bg-black/30 sm:hidden"
              onClick={() => setShowSortDropdown(false)}
            ></div>
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl sm:rounded-xl z-50 sm:absolute sm:bottom-auto sm:right-0 sm:left-auto sm:top-full sm:mt-2 shadow-xl sm:w-56 max-h-[50vh] overflow-auto">
              <div className="flex items-center justify-between p-4 border-b sm:hidden">
                <h3 className="font-medium">Sort By</h3>
                <button onClick={() => setShowSortDropdown(false)}>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="py-2">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`w-full text-left px-4 py-3 sm:py-2 hover:bg-gray-50 ${
                      sortOption === option.value
                        ? "text-primary-600 font-medium"
                        : "text-gray-700"
                    }`}
                    onClick={() => {
                      onSort(option.value);
                      setShowSortDropdown(false);
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filter Button */}
      <div className="relative" ref={filterRef}>
        <button
          className="rounded-lg border border-gray-200 px-3 py-2 bg-white shadow-sm hover:bg-gray-50 transition-colors flex items-center"
          onClick={() => setShowFilterDropdown(!showFilterDropdown)}
          aria-label="Filter products"
        >
          <svg
            className="h-5 w-5 text-gray-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>
          <span className="ml-2 hidden sm:inline text-sm font-medium">
            Filter
          </span>
          {filterOptions && filterOptions.categories?.length > 0 && (
            <span className="ml-1 text-primary-600 hidden sm:inline">
              • {filterOptions.categories.length}
            </span>
          )}
        </button>

        {showFilterDropdown && (
          <div className="fixed inset-0 z-40 sm:relative sm:inset-auto">
            <div
              className="absolute inset-0 bg-black/30 sm:hidden"
              onClick={() => setShowFilterDropdown(false)}
            ></div>
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl sm:rounded-xl z-50 sm:absolute sm:bottom-auto sm:right-0 sm:left-auto sm:top-full sm:mt-2 shadow-xl sm:w-72 max-h-[70vh] overflow-auto">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-medium">Filter Options</h3>
                <button
                  className="sm:hidden"
                  onClick={() => setShowFilterDropdown(false)}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-medium mb-3 text-gray-800">Price Range</h3>
                <div className="flex items-center space-x-3 mb-6">
                  <input
                    type="number"
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Min"
                    min={calculatedPriceRange.min}
                    max={calculatedPriceRange.max}
                    value={localFilterOptions.priceMin}
                    onChange={(e) =>
                      handlePriceChange("priceMin", e.target.value)
                    }
                  />
                  <span className="text-gray-400">to</span>
                  <input
                    type="number"
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Max"
                    min={calculatedPriceRange.min}
                    max={calculatedPriceRange.max}
                    value={localFilterOptions.priceMax}
                    onChange={(e) =>
                      handlePriceChange("priceMax", e.target.value)
                    }
                  />
                </div>

                {availableCategories.length > 0 && (
                  <>
                    <h3 className="font-medium mb-3 text-gray-800">
                      Categories
                    </h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto mb-6">
                      {availableCategories.map((category) => (
                        <label
                          key={category}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={localFilterOptions.categories.includes(
                              category
                            )}
                            onChange={() => handleCategoryChange(category)}
                            className="rounded text-primary-500 focus:ring-primary-500 h-4 w-4"
                          />
                          <span className="text-gray-700">{category}</span>
                        </label>
                      ))}
                    </div>
                  </>
                )}

                <div className="flex justify-between space-x-3 mt-4">
                  <button
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
                    onClick={() => {
                      setLocalFilterOptions({
                        priceMin: calculatedPriceRange.min,
                        priceMax: calculatedPriceRange.max,
                        categories: [],
                      });
                    }}
                  >
                    Reset
                  </button>
                  <button
                    className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    onClick={handleApplyFilters}
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SortFilterControls;
