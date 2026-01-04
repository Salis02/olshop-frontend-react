import apiClient from './client';

export const paymentApi = {
    // Get all payments (role-based access)
    getAll: async (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.status) params.append('status', filters.status);
        if (filters.page) params.append('page', filters.page);
        if (filters.limit) params.append('limit', filters.limit);

        const response = await apiClient.get(`/payments?${params.toString()}`);
        return response.data;
    },

    // Get payment detail by ID
    getById: async (id) => {
        const response = await apiClient.get(`/payments/${id}`);
        return response.data;
    },

    // Create payment for order
    create: async (data) => {
        const response = await apiClient.post('/payments', data);
        return response.data;
    },

    // Update payment status (Admin only)
    updateStatus: async (id, status) => {
        const response = await apiClient.put(`/payments/${id}/status`, { status });
        return response.data;
    },

    // Handle payment notification (webhook - public)
    handleNotification: async (data) => {
        const response = await apiClient.post('/payments/notification', data);
        return response.data;
    }
};
