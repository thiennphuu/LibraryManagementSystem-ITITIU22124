import apiClient from '../utils/apiClient';
import { handleApiError } from '../utils/errorHandler';

/**
 * Book API Service
 * Maps to BookController endpoints
 */
const bookApi = {
  /**
   * Get all books
   * GET /books
   */
  getAllBooks: async (params = {}) => {
    try {
      const response = await apiClient.get('/books', { params });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get book by ID
   * GET /books/{id}
   */
  getBookById: async (id) => {
    try {
      const response = await apiClient.get(`/books/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Search books
   * GET /books/search?query={query}
   */
  searchBooks: async (query, filters = {}) => {
    try {
      const response = await apiClient.get('/books/search', {
        params: { query, ...filters },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get available books
   * GET /books/available
   */
  getAvailableBooks: async () => {
    try {
      const response = await apiClient.get('/books/available');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Create new book (Admin only)
   * POST /books
   */
  createBook: async (bookData) => {
    try {
      const response = await apiClient.post('/books', bookData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update book (Admin only)
   * PUT /books/{id}
   */
  updateBook: async (id, bookData) => {
    try {
      const response = await apiClient.put(`/books/${id}`, bookData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Delete book (Admin only)
   * DELETE /books/{id}
   */
  deleteBook: async (id) => {
    try {
      const response = await apiClient.delete(`/books/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get books by category
   * GET /books/category/{category}
   */
  getBooksByCategory: async (category) => {
    try {
      const response = await apiClient.get(`/books/category/${category}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get books by author
   * GET /books/author/{author}
   */
  getBooksByAuthor: async (author) => {
    try {
      const response = await apiClient.get(`/books/author/${author}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export default bookApi;
