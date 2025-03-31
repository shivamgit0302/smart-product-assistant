"use client";

import { memo } from "react";

const ProductList = memo(function ProductList({ products, onSelectProduct }) {
  if (!products || products.length === 0) {
    return (
      <div className="py-20 text-center">
        <svg
          className="mx-auto h-16 w-16 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          No products found
        </h3>
        <p className="mt-2 text-gray-500 text-lg">
          Try a different search query or browse our categories.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <div
          key={product._id}
          className="card overflow-hidden cursor-pointer group"
          onClick={() => onSelectProduct(product)}
        >
          <div className="relative overflow-hidden">
            <img
              src={product.imageUrl || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
            {product.relevanceScore > 0 && (
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-semibold">
                {product.relevanceScore}% Match
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-white text-sm line-clamp-2">
                  {product.description}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-primary-600 transition-colors line-clamp-1">
                {product.name}
              </h3>
              <span className="font-bold text-accent-600">
                ${product.price.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="badge-primary">{product.category}</span>

              {product.relevanceScore > 0 && (
                <div className="flex items-center">
                  <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-500 rounded-full"
                      style={{ width: `${product.relevanceScore}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 flex space-x-2">
              <button className="w-full py-2 text-center text-primary-600 font-medium border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors">
                View Details
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});

export default ProductList;
