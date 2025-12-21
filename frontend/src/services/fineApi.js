import apiClient from '../utils/apiClient';
import { handleApiError } from '../utils/errorHandler';

/**
 * Fine API Service
 * Maps to FineController endpoints
 */
const fineApi = {
  /**
   * Get current user's fines
   * GET /fines/my-fines
   */
  getMyFines: async () => {
    try {
      const response = await apiClient.get('/fines/my-fines');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get current user's unpaid fines
   * GET /fines/my-fines/unpaid
   */
  getMyUnpaidFines: async () => {
    try {
      const response = await apiClient.get('/fines/my-fines/unpaid');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get current user's fine summary
   * GET /fines/my-fines/summary
   */
  getMyFineSummary: async () => {
    try {
      const response = await apiClient.get('/fines/my-fines/summary');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Pay a specific fine
   * POST /fines/{id}/pay
   */
  payFine: async (fineId) => {
    try {
      const response = await apiClient.post(`/fines/${fineId}/pay`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Pay all unpaid fines
   * POST /fines/pay-all
   */
  payAllFines: async () => {
    try {
      const response = await apiClient.post('/fines/pay-all');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Preview fine calculation
   * GET /fines/preview
   */
  previewFine: async (dueDate, returnDate) => {
    try {
      const response = await apiClient.get('/fines/preview', {
        params: { dueDate, returnDate }
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get fine by ID
   * GET /fines/{id}
   */
  getFineById: async (id) => {
    try {
      const response = await apiClient.get(`/fines/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // ==================== ADMIN ENDPOINTS ====================

  /**
   * Get all fines (Admin)
   * GET /fines
   */
  getAllFines: async () => {
    try {
      const response = await apiClient.get('/fines');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get all unpaid fines (Admin)
   * GET /fines/unpaid
   */
  getAllUnpaidFines: async () => {
    try {
      const response = await apiClient.get('/fines/unpaid');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get fines for a specific user (Admin)
   * GET /fines/user/{userId}
   */
  getFinesByUser: async (userId) => {
    try {
      const response = await apiClient.get(`/fines/user/${userId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get fine statistics (Admin)
   * GET /fines/statistics
   */
  getStatistics: async () => {
    try {
      const response = await apiClient.get('/fines/statistics');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Waive a fine (Admin)
   * POST /fines/{id}/waive
   */
  waiveFine: async (fineId) => {
    try {
      const response = await apiClient.post(`/fines/${fineId}/waive`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export default fineApi;
