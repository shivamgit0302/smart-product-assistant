"use client";

import { createContext, useState, useEffect, useContext } from "react";
import config from "../config";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tokenRefreshTimer, setTokenRefreshTimer] = useState(null);

  useEffect(() => {
    // Check if user is logged in on mount
    fetchCurrentUser();

    // Listen for storage events (for multi-tab support)
    const handleStorageChange = (e) => {
      if (e.key === "token") {
        if (!e.newValue) {
          // Token removed in another tab
          setCurrentUser(null);
          clearTokenRefreshTimer();
        } else if (e.newValue !== localStorage.getItem("token")) {
          // Token changed in another tab
          fetchCurrentUser();
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearTokenRefreshTimer();
    };
  }, []);

  const clearTokenRefreshTimer = () => {
    if (tokenRefreshTimer) {
      clearTimeout(tokenRefreshTimer);
      setTokenRefreshTimer(null);
    }
  };

  // Set up token refresh timer (refresh 1 hour before expiry)
  const setupTokenRefresh = (token) => {
    clearTokenRefreshTimer();

    try {
      // Decode token to get expiry
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const payload = JSON.parse(window.atob(base64));

      if (payload.exp) {
        const expiryTime = payload.exp * 1000; // Convert to milliseconds
        const currentTime = Date.now();
        const timeUntilRefresh = expiryTime - currentTime - 60 * 60 * 1000; // Refresh 1 hour before expiry

        if (timeUntilRefresh > 0) {
          console.log(
            `Setting token refresh in ${Math.floor(
              timeUntilRefresh / 1000 / 60
            )} minutes`
          );
          const timer = setTimeout(() => refreshToken(), timeUntilRefresh);
          setTokenRefreshTimer(timer);
        } else {
          // Token is already expired or about to expire, refresh now
          refreshToken();
        }
      }
    } catch (err) {
      console.error("Error setting up token refresh:", err);
    }
  };

  const refreshToken = async () => {
    try {
      const response = await fetch(`${config.API_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        setCurrentUser(data.user);
        setupTokenRefresh(data.token);
      } else {
        // If refresh fails, log the user out
        logout();
      }
    } catch (err) {
      console.error("Token refresh error:", err);
      logout();
    }
  };

  const fetchCurrentUser = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found in localStorage");
        setCurrentUser(null);
        setLoading(false);
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      console.log("Fetching user data with token");
      const response = await fetch(`${config.API_URL}/auth/me`, {
        headers,
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        console.log("User data fetched successfully:", data.user);
        setCurrentUser(data.user);

        // Set up token refresh
        setupTokenRefresh(token);
      } else {
        console.error("Failed to fetch user data:", response.status);

        // Only clear token on auth errors
        if (response.status === 401) {
          console.log("Unauthorized - clearing token");
          localStorage.removeItem("token");
          setCurrentUser(null);
        }
      }
    } catch (err) {
      console.error("Error fetching user:", err);
    } finally {
      setLoading(false);
    }
  };

  // Include token in all API requests
  const apiWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem("token");

    const headers = {
      ...options.headers,
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return fetch(url, {
      ...options,
      headers,
      credentials: "include",
    });
  };

  const register = async (email, password, name) => {
    try {
      setError(null);
      const response = await apiWithAuth(`${config.API_URL}/auth/register`, {
        method: "POST",
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setCurrentUser(data.user);
      localStorage.setItem("token", data.token);
      setupTokenRefresh(data.token);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await apiWithAuth(`${config.API_URL}/auth/login`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      setCurrentUser(data.user);
      localStorage.setItem("token", data.token);
      setupTokenRefresh(data.token);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await apiWithAuth(`${config.API_URL}/auth/logout`, {
        method: "POST",
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // Always clear user state and token
      setCurrentUser(null);
      localStorage.removeItem("token");
      clearTokenRefreshTimer();
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    register,
    login,
    logout,
    apiWithAuth, // Expose for other authenticated API calls
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
