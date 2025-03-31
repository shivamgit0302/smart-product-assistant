"use client";

function SearchHistory({ history, onSearchAgain }) {
  if (!history || history.length === 0) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto mt-6 bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-primary-100">
      <h3 className="text-sm font-medium text-gray-600 mb-3 flex items-center">
        <svg
          className="h-4 w-4 mr-1 text-primary-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Recent Searches
      </h3>
      <ul className="divide-y divide-gray-100">
        {history.slice(0, 5).map((item, index) => (
          <li
            key={index}
            className="py-2 flex justify-between items-center hover:bg-primary-50 rounded px-3 cursor-pointer transition-colors group"
            onClick={() => onSearchAgain(item.query)}
          >
            <span className="text-primary-600 group-hover:text-primary-700 font-medium">
              {item.query}
            </span>
            <div className="flex items-center">
              <span className="text-xs text-gray-500 mr-2">
                {new Date(item.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <svg
                className="h-4 w-4 text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SearchHistory;
