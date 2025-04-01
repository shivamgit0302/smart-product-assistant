"use client";

import { useAuth } from "../contexts/AuthContext";

function EmptyState() {
  const { currentUser } = useAuth();

  return (
    <div className="text-center py-12">
      <div className="mx-auto h-24 w-24 text-blue-400">
        <svg
          className="h-full w-full"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
      </div>
      <h3 className="mt-2 text-xl font-medium text-gray-900">
        Find the perfect products
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        Use the search bar above to describe what you're looking for.
      </p>

      {!currentUser && (
        <div className="mt-6 inline-block bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 rounded-lg p-5 text-gray-700 text-sm shadow-sm">
          <p className="font-medium mb-2 text-blue-700">
            💡 Create an account or log in to:
          </p>
          <ul className="text-left space-y-2">
            {[
              "Save your search history",
              "Get faster results with cached searches",
              "Track your favorite products",
            ].map((benefit, index) => (
              <li key={index} className="flex items-start">
                <svg
                  className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default EmptyState;
