import apiClient from './client';

export const eventApi = {
    // Get all events
    getAll: async (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.status) params.append('status', filters.status);
        if (filters.page) params.append('page', filters.page);
        if (filters.limit) params.append('limit', filters.limit);

        const response = await apiClient.get(`/events?${params.toString()}`);
        return response.data;
    },

    // Get event by ID
    getById: async (id) => {
        const response = await apiClient.get(`/events/${id}`);
        return response.data;
    },

    // Get event by slug
    getBySlug: async (slug) => {
        const response = await apiClient.get(`/events/slug/${slug}`);
        return response.data;
    },

    // Create event (Admin only)
    create: async (data) => {
        const response = await apiClient.post('/events', data);
        return response.data;
    },

    // Update event (Admin only)
    update: async (id, data) => {
        const response = await apiClient.put(`/events/${id}`, data);
        return response.data;
    },

    // Delete event (Admin only)
    delete: async (id) => {
        const response = await apiClient.delete(`/events/${id}`);
        return response.data;
    }
};
