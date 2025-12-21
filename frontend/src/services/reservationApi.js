import apiClient from '../utils/apiClient';
import { handleApiError } from '../utils/errorHandler';

/**
 * Reservation API Service
 * Maps to ReservationController endpoints
 */
const reservationApi = {
  /**
   * Create a reservation
   * POST /reservations
   */
  createReservation: async (reservationData) => {
    try {
      const response = await apiClient.post('/reservations', reservationData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get reservations by user
   * GET /reservations/user/{userId}
   */
  getReservationsByUser: async (userId) => {
    try {
      const response = await apiClient.get(`/reservations/user/${userId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get current user's reservations
   * GET /reservations/my-reservations
   */
  getMyReservations: async () => {
    try {
      const response = await apiClient.get('/reservations/my-reservations');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Cancel a reservation
   * PUT /reservations/{id}/cancel
   */
  cancelReservation: async (reservationId) => {
    try {
      const response = await apiClient.put(`/reservations/${reservationId}/cancel`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Mark reservation as ready (Admin)
   * PUT /reservations/{id}/ready
   */
  markAsReady: async (reservationId) => {
    try {
      const response = await apiClient.put(`/reservations/${reservationId}/ready`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get all reservations (Admin)
   * GET /reservations
   */
  getAllReservations: async () => {
    try {
      const response = await apiClient.get('/reservations');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get reservations for a book
   * GET /reservations/book/{bookId}
   */
  getReservationsForBook: async (bookId) => {
    try {
      const response = await apiClient.get(`/reservations/book/${bookId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get queue position
   * GET /reservations/{id}/position
   */
  getQueuePosition: async (reservationId) => {
    try {
      const response = await apiClient.get(`/reservations/${reservationId}/position`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Fulfill reservation (convert to borrow)
   * POST /reservations/{id}/fulfill
   */
  fulfillReservation: async (reservationId) => {
    try {
      const response = await apiClient.post(`/reservations/${reservationId}/fulfill`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export default reservationApi;
