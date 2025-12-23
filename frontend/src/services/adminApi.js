import apiClient from '../utils/apiClient';
import { handleApiError } from '../utils/errorHandler';

const adminApi = {
  getStats: async () => {
    try {
      const response = await apiClient.get('/admin/stats');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export default adminApi;
