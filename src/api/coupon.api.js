import apiClient from './client';

export const couponApi = {
    // Get all coupons (authenticated users)
    getAll: async (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.page) params.append('page', filters.page);
        if (filters.limit) params.append('limit', filters.limit);

        const response = await apiClient.get(`/coupons?${params.toString()}`);
        return response.data;
    },

    // Get coupon by ID
    getById: async (id) => {
        const response = await apiClient.get(`/coupons/${id}`);
        return response.data;
    },

    // Validate coupon code
    validate: async (code) => {
        const response = await apiClient.get(`/coupons/${code}`);
        return response.data;
    },

    // Create coupon (Admin only)
    create: async (data) => {
        const response = await apiClient.post('/coupons', data);
        return response.data;
    },

    // Update coupon (Admin only)
    update: async (id, data) => {
        const response = await apiClient.put(`/coupons/${id}`, data);
        return response.data;
    },

    // Delete coupon (Admin only)
    delete: async (id) => {
        const response = await apiClient.delete(`/coupons/${id}`);
        return response.data;
    }
};
