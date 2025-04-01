import { useState } from "react";
import Login from "./Login";
import Register from "./Register";

function AuthModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("login");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div
          className="fixed inset-0 bg-black opacity-50"
          onClick={onClose}
        ></div>

        <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-auto z-10">
          <div className="flex justify-between items-center p-4 border-b">
            <div className="flex w-full">
              <button
                className={`flex-1 py-2 text-center font-medium rounded-t-lg transition-colors ${
                  activeTab === "login"
                    ? "text-primary-600 border-b-2 border-primary-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("login")}
              >
                Login
              </button>
              <button
                className={`flex-1 py-2 text-center font-medium rounded-t-lg transition-colors ${
                  activeTab === "register"
                    ? "text-primary-600 border-b-2 border-primary-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("register")}
              >
                Register
              </button>
            </div>

            <button
              className="text-gray-400 hover:text-gray-600"
              onClick={onClose}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="p-4">
            {activeTab === "login" ? (
              <Login onSuccess={onClose} />
            ) : (
              <Register onSuccess={onClose} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
