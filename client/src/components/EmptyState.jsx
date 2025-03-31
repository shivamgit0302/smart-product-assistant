function EmptyState() {
  return (
    <div className="py-16 text-center">
      <svg
        className="mx-auto h-20 w-20 text-primary-300"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <h3 className="mt-6 text-2xl font-medium text-gray-900">
        Describe what you're looking for
      </h3>
      <p className="mt-3 text-gray-500 text-lg max-w-lg mx-auto">
        Our AI assistant can understand natural language. Try searching for
        something like:
      </p>
      <div className="mt-6 flex flex-wrap gap-3 justify-center max-w-2xl mx-auto">
        <div className="bg-primary-50 text-primary-700 px-4 py-2 rounded-lg text-sm">
          "A lightweight laptop for college under $1000"
        </div>
        <div className="bg-primary-50 text-primary-700 px-4 py-2 rounded-lg text-sm">
          "Noise-cancelling headphones for travel"
        </div>
        <div className="bg-primary-50 text-primary-700 px-4 py-2 rounded-lg text-sm">
          "Gift for a coffee enthusiast"
        </div>
        <div className="bg-primary-50 text-primary-700 px-4 py-2 rounded-lg text-sm">
          "Waterproof hiking boots with good ankle support"
        </div>
      </div>
    </div>
  );
}

export default EmptyState;
