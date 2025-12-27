import apiClient from "./client";

export const userApi = {
    // Get user profile
    getProfile: async () => {
        const response = await apiClient.get('/user/profile');
        return response.data;
    },

    // Update user profile
    updateProfile: async (data) => {
        const response = await apiClient.put('/user/profile', data);
        return response.data;
    },

    // Change password
    changePassword: async (data) => {
        const response = await apiClient.put('/user/change-password', data);
        return response.data;
    },

    // Get all users (Admin only)
    getAll: async (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.page) params.append('page', filters.page);
        if (filters.limit) params.append('limit', filters.limit);

        const response = await apiClient.get(`/user/users?${params.toString()}`);
        return response.data;
    },

    // Archive user (Admin only)
    archive: async (id) => {
        const response = await apiClient.put(`/user/${id}/archieve`);
        return response.data;
    },

    // Restore user (Admin only)
    restore: async (id) => {
        const response = await apiClient.put(`/user/${id}/restore`);
        return response.data;
    }
};
