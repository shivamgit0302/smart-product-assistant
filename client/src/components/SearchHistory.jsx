"use client";

function SearchHistory({ history, onSearchAgain }) {
  if (!history || history.length === 0) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto mt-6 bg-white/10 rounded-xl p-4 shadow-lg border border-white/20">
      <h3 className="text-sm font-medium text-white mb-3 flex items-center">
        <svg
          className="h-4 w-4 mr-1 text-blue-200 flex-shrink-0"
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
      <ul className="divide-y divide-white/10">
        {history.slice(0, 5).map((item, index) => (
          <li
            key={index}
            className="py-2 hover:bg-white/10 rounded px-3 cursor-pointer transition-colors group"
            onClick={() => onSearchAgain(item.query)}
          >
            <div className="flex justify-between items-start">
              <span className="text-blue-50 group-hover:text-white font-medium text-left mr-2 break-words">
                {item.query}
              </span>
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xs text-blue-200 whitespace-nowrap">
                  {new Date(item.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <svg
                  className="h-4 w-4 text-blue-200 opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex-shrink-0"
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
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SearchHistory;
