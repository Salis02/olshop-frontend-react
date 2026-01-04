import apiClient from './client';

export const eventProductApi = {
    // Get products by event ID
    getByEventId: async (eventId, filters = {}) => {
        const params = new URLSearchParams();
        if (filters.page) params.append('page', filters.page);
        if (filters.limit) params.append('limit', filters.limit);

        const response = await apiClient.get(`/event-products/${eventId}/products?${params.toString()}`);
        return response.data;
    },

    // Add product to event (Admin only)
    create: async (eventId, data) => {
        const response = await apiClient.post(`/event-products/${eventId}/products`, data);
        return response.data;
    },

    // Remove product from event (Admin only)
    delete: async (eventId, id) => {
        const response = await apiClient.delete(`/event-products/${eventId}/products/${id}`);
        return response.data;
    }
};
