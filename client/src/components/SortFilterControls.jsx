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
    <div className="flex space-x-3 md:space-x-4 mb-6">
      {/* Sort Dropdown */}
      <div className="relative" ref={sortRef}>
        <button
          className="btn-secondary text-sm flex items-center"
          onClick={() => setShowSortDropdown(!showSortDropdown)}
        >
          <svg
            className="h-4 w-4 mr-1"
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
          Sort
          {sortOption && (
            <span className="ml-1 text-primary-600">
              •{" "}
              {sortOptions.find((opt) => opt.value === sortOption)?.label || ""}
            </span>
          )}
        </button>

        {showSortDropdown && (
          <div className="absolute z-10 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${
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
        )}
      </div>

      {/* Filter Dropdown */}
      <div className="relative" ref={filterRef}>
        <button
          className="btn-secondary text-sm flex items-center"
          onClick={() => setShowFilterDropdown(!showFilterDropdown)}
        >
          <svg
            className="h-4 w-4 mr-1"
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
          Filter
          {filterOptions && (
            <span className="ml-1 text-primary-600">
              •{" "}
              {(filterOptions.categories?.length || 0) +
                (filterOptions.priceMin !== calculatedPriceRange.min ||
                filterOptions.priceMax !== calculatedPriceRange.max
                  ? 1
                  : 0)}
            </span>
          )}
        </button>

        {showFilterDropdown && (
          <div className="absolute z-10 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
            <h3 className="font-medium mb-3 text-gray-800">Price Range</h3>
            <div className="flex items-center space-x-3 mb-6">
              <input
                type="number"
                className="input w-28 py-1"
                placeholder="Min"
                min={calculatedPriceRange.min}
                max={calculatedPriceRange.max}
                value={localFilterOptions.priceMin}
                onChange={(e) => handlePriceChange("priceMin", e.target.value)}
              />
              <span className="text-gray-400">to</span>
              <input
                type="number"
                className="input w-28 py-1"
                placeholder="Max"
                min={calculatedPriceRange.min}
                max={calculatedPriceRange.max}
                value={localFilterOptions.priceMax}
                onChange={(e) => handlePriceChange("priceMax", e.target.value)}
              />
            </div>

            {availableCategories.length > 0 && (
              <>
                <h3 className="font-medium mb-3 text-gray-800">Categories</h3>
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
                        className="rounded text-primary-500 focus:ring-primary-500"
                      />
                      <span className="text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
              </>
            )}

            <div className="flex justify-between space-x-3">
              <button
                className="btn-secondary flex-1 py-1"
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
                className="btn-primary flex-1 py-1"
                onClick={handleApplyFilters}
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SortFilterControls;
