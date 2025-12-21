import apiClient from '../utils/apiClient';
import { handleApiError } from '../utils/errorHandler';

/**
 * User API Service
 * Maps to UserController and AuthenticationController endpoints
 */
const userApi = {
  /**
   * Register new user
   * POST /auth/register
   */
  register: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Login user
   * POST /auth/login
   */
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get current user profile
   * GET /users/me
   */
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/users/me');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get user by ID
   * GET /users/{id}
   */
  getUserById: async (id) => {
    try {
      const response = await apiClient.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update user profile
   * PUT /users/{id}
   */
  updateUser: async (id, userData) => {
    try {
      const response = await apiClient.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Change password
   * PUT /users/{id}/password
   */
  changePassword: async (id, passwordData) => {
    try {
      const response = await apiClient.put(`/users/${id}/password`, passwordData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get all users (Admin only)
   * GET /users
   */
  getAllUsers: async () => {
    try {
      const response = await apiClient.get('/users');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Delete user (Admin only)
   * DELETE /users/{id}
   */
  deleteUser: async (id) => {
    try {
      const response = await apiClient.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Logout user
   * POST /auth/logout
   */
  logout: async () => {
    try {
      const response = await apiClient.post('/auth/logout');
      return response.data;
    } catch (error) {
      // Logout should succeed even if API fails
      return { success: true };
    }
  },
};

export default userApi;
