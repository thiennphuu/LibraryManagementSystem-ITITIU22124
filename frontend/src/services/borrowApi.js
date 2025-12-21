import apiClient from '../utils/apiClient';
import { handleApiError } from '../utils/errorHandler';

/**
 * Borrow API Service
 * Maps to BorrowController endpoints
 */
const borrowApi = {
  /**
   * Borrow a book
   * POST /borrow
   */
  borrowBook: async (borrowData) => {
    try {
      const response = await apiClient.post('/borrow', borrowData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Return a book
   * POST /borrow/return
   */
  returnBook: async (borrowId) => {
    try {
      const response = await apiClient.post(`/borrow/${borrowId}/return`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get borrowed books by user
   * GET /borrow/user/{userId}
   */
  getBorrowedBooksByUser: async (userId) => {
    try {
      const response = await apiClient.get(`/borrow/user/${userId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get current user's borrowed books
   * GET /borrow/my-books
   */
  getMyBorrowedBooks: async () => {
    try {
      const response = await apiClient.get('/borrow/my-books');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get overdue books (Admin)
   * GET /borrow/overdue
   */
  getOverdueBooks: async () => {
    try {
      const response = await apiClient.get('/borrow/overdue');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get all borrows (Admin)
   * GET /borrow
   */
  getAllBorrows: async () => {
    try {
      const response = await apiClient.get('/borrow');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Extend borrow period
   * PUT /borrow/{id}/extend
   */
  extendBorrow: async (borrowId) => {
    try {
      const response = await apiClient.put(`/borrow/${borrowId}/extend`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get borrow history for a book
   * GET /borrow/book/{bookId}/history
   */
  getBookBorrowHistory: async (bookId) => {
    try {
      const response = await apiClient.get(`/borrow/book/${bookId}/history`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export default borrowApi;
