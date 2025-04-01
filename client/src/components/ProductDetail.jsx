"use client";

function ProductDetail({ product, onBack }) {
  return (
    <div>
      <div className="flex items-center mb-8">
        <button
          className="inline-flex items-center text-primary-600 hover:text-primary-700 focus:outline-none group"
          onClick={onBack}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to results
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        <div className="lg:w-2/5">
          <div className="sticky top-8">
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <img
                src={product.imageUrl || "/placeholder.svg"}
                alt={product.name}
                className="w-full rounded-lg shadow-sm object-contain h-80"
              />
            </div>

            {product.relevanceScore > 0 && (
              <div className="bg-primary-50 rounded-xl p-6 border border-primary-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <svg
                    className="h-5 w-5 mr-2 text-primary-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  Match Score
                </h3>
                <div className="flex items-center mb-2">
                  <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full bg-primary-500 rounded-full"
                      style={{ width: `${product.relevanceScore}%` }}
                    ></div>
                  </div>
                  <span className="ml-3 font-semibold text-primary-700">
                    {product.relevanceScore}%
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  This product matches your search criteria with high relevance.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:w-3/5">
          <div className="mb-2">
            <span className="badge-primary text-sm">{product.category}</span>
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {product.name}
          </h2>

          <div className="flex items-center mb-6">
            <span className="text-2xl font-bold text-accent-600 mr-4">
              ${product.price.toFixed(2)}
            </span>
            <span className="text-sm text-gray-500 line-through">
              ${(product.price * 1.2).toFixed(2)}
            </span>
            <span className="ml-2 badge-accent">20% OFF</span>
          </div>

          <div className="prose prose-lg max-w-none mb-8">
            <p className="text-gray-700 leading-relaxed">
              {product.description}
            </p>
          </div>

          {product.attributes && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Specifications
              </h3>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  {product.attributes.color && (
                    <div className="flex">
                      <dt className="w-28 flex-shrink-0 font-medium text-gray-600">
                        Color:
                      </dt>
                      <dd className="text-gray-800">
                        {product.attributes.color}
                      </dd>
                    </div>
                  )}
                  {product.attributes.size && (
                    <div className="flex">
                      <dt className="w-28 flex-shrink-0 font-medium text-gray-600">
                        Size:
                      </dt>
                      <dd className="text-gray-800">
                        {product.attributes.size}
                      </dd>
                    </div>
                  )}
                  {product.attributes.weight && (
                    <div className="flex">
                      <dt className="w-28 flex-shrink-0 font-medium text-gray-600">
                        Weight:
                      </dt>
                      <dd className="text-gray-800">
                        {product.attributes.weight}
                      </dd>
                    </div>
                  )}
                  {product.attributes.features &&
                    product.attributes.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex col-span-1 md:col-span-2"
                      >
                        <dt className="w-28 flex-shrink-0 font-medium text-gray-600">
                          {index === 0 ? "Features:" : ""}
                        </dt>
                        <dd className="text-gray-800">{feature}</dd>
                      </div>
                    ))}
                </dl>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
