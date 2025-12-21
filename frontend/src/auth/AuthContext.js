import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const ACCESS_TOKEN_KEY = 'library_access_token';
const REFRESH_TOKEN_KEY = 'library_refresh_token';
const USER_KEY = 'library_user';

// Token management functions (exported for apiClient)
export const getToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);
export const setTokens = (accessToken, refreshToken) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
};
export const removeToken = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem(USER_KEY);
    const token = getToken();

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        removeToken();
      }
    }
    setLoading(false);
  }, []);

  // Login function - accepts the full auth response
  const login = (authResponse) => {
    const { accessToken, refreshToken, userId, name, email, role } = authResponse;
    setTokens(accessToken, refreshToken);
    const userData = { userId, name, email, role };
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setUser(userData);
  };

  // Logout function
  const logout = () => {
    removeToken();
    setUser(null);
  };

  // Update user data
  const updateUser = (userData) => {
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setUser(userData);
  };

  // Update tokens (for refresh token flow)
  const updateTokens = (accessToken, refreshToken) => {
    setTokens(accessToken, refreshToken);
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return user?.role === role;
  };

  // Check if user is admin
  const isAdmin = () => {
    return hasRole('ADMIN');
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user && !!getToken();
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateUser,
    updateTokens,
    hasRole,
    isAdmin,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
