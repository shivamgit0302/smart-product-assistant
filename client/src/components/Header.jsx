import { useAuth } from "../contexts/AuthContext";

function Header({ onShowAuthModal }) {
  const { currentUser, loading, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="mr-3 text-blue-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-8 h-8"
            >
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
          </div>
          <h1 className="font-sans text-xl font-medium bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Smart Product Assistant
          </h1>
        </div>

        {loading ? (
          <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
        ) : currentUser ? (
          <div className="flex items-center">
            <div className="mr-3 bg-blue-100 text-blue-600 rounded-full h-8 w-8 flex items-center justify-center">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col mr-4">
              <span className="text-sm font-medium text-gray-900">
                {currentUser.name}
              </span>
              <span className="text-xs text-gray-500">{currentUser.email}</span>
            </div>
            <button
              onClick={logout}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={onShowAuthModal}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-150"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
            Login / Register
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
