import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

/**
 * ProtectedRoute component
 * Wraps routes that require authentication or specific roles
 * 
 * Usage:
 * <ProtectedRoute>
 *   <UserProfilePage />
 * </ProtectedRoute>
 * 
 * <ProtectedRoute role="ADMIN">
 *   <AdminDashboardPage />
 * </ProtectedRoute>
 */
const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, hasRole, loading } = useAuth();
  const location = useLocation();

  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role if specified
  if (role && !hasRole(role)) {
    return (
      <div className="page">
        <div className="container">
          <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
            <h2>Access Denied</h2>
            <p style={{ color: '#666', marginTop: '10px' }}>
              You don't have permission to access this page.
            </p>
            <button
              className="btn btn-primary"
              style={{ marginTop: '20px' }}
              onClick={() => window.history.back()}
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
