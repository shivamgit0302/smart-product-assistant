"use client";

import { useAuth } from "../contexts/AuthContext";

function EmptyState() {
  const { currentUser } = useAuth();

  return (
    <div className="text-center py-12">
      <div className="mx-auto h-24 w-24 text-gray-400">
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
      <h3 className="mt-2 text-lg font-medium text-gray-900">
        Find the perfect products
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        Use the search bar above to describe what you're looking for.
      </p>

      {!currentUser && (
        <div className="mt-6 inline-block bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800 text-sm">
          <p className="font-medium mb-1">💡 Create an account or log in to:</p>
          <ul className="text-left list-disc pl-5 text-blue-700">
            <li>Save your search history</li>
            <li>Get faster results with cached searches</li>
            <li>Track your favorite products</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default EmptyState;
