import apiClient from './client';

export const activityApi = {
    // Get activity logs (Admin only)
    getAll: async (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.action) params.append('action', filters.action);
        if (filters.user_id) params.append('user_id', filters.user_id);
        if (filters.target_type) params.append('target_type', filters.target_type);
        if (filters.page) params.append('page', filters.page);
        if (filters.limit) params.append('limit', filters.limit);

        const response = await apiClient.get(`/activities?${params.toString()}`);
        return response.data;
    }
};
