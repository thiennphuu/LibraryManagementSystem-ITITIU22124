import apiClient from '../utils/apiClient';
import { handleApiError } from '../utils/errorHandler';

const recommendationApi = {
    getRecommendations: async (userId) => {
        try {
            const response = await apiClient.get(`/users/${userId}/recommendations`);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    }
};

export default recommendationApi;
