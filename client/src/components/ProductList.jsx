"use client";

import { memo } from "react";


function ProductCard({ product, onSelect }) {
  // Use the imageUrl from the product, or fall back to a placeholder
  const imageUrl =
    product.imageUrl ||
    `/images/products/${product._id}.jpg` ||
    "/placeholder.jpg";

  return (
    <div
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-100 hover:border-blue-100 group"
      onClick={() => onSelect(product)}
    >
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-100 group-hover:bg-blue-50 transition-colors">
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-center object-cover transform group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.onerror = null; // Prevent infinite loop
            e.target.src = "/placeholder.jpg"; // Fallback image
          }}
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>
        <p className="mt-1 text-sm text-gray-500">{product.category}</p>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-lg font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </p>
          {product.relevanceScore && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-green-50 to-emerald-50 text-emerald-700 border border-emerald-200">
              Match: {product.relevanceScore}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

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
        <ProductCard
          key={product._id}
          product={product}
          onSelect={onSelectProduct}
        />
      ))}
    </div>
  );
});

export default ProductList;
