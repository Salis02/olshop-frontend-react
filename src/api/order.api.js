import apiClient from "./client";

export const orderApi = {
    // Create a new order
    create: async (data) => {
        const response = await apiClient.post('/orders', data);
        return response.data;
    },

    // Get all orders (with role-based access control handled by backend)
    getAll: async (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.status) params.append('status', filters.status);
        if (filters.page) params.append('page', filters.page);
        if (filters.limit) params.append('limit', filters.limit);

        const response = await apiClient.get(`/orders?${params.toString()}`);
        return response.data;
    },

    // Get order details by UUID
    getById: async (uuid) => {
        const response = await apiClient.get(`/orders/${uuid}`);
        return response.data;
    }
};
