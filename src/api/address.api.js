import apiClient from "./client";

export const addressApi = {
    // Get all addresses for the current user
    getAll: async () => {
        const response = await apiClient.get('/addresses');
        return response.data;
    },

    // Create a new address
    create: async (data) => {
        const response = await apiClient.post('/addresses', data);
        return response.data;
    },

    // Update an address by ID
    update: async (id, data) => {
        const response = await apiClient.put(`/addresses/${id}`, data);
        return response.data;
    },

    // Delete an address by ID
    remove: async (id) => {
        const response = await apiClient.delete(`/addresses/${id}`);
        return response.data;
    }
};
