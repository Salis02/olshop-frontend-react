import apiClient from "./client";

export const shipmentApi = {
    // Get all shipments
    getAll: async (filters = {}) => {
        const params = new URLSearchParams(filters);
        const response = await apiClient.get(`/shipments?${params.toString()}`);
        return response.data;
    },

    // Create shipment
    create: async (shipmentData) => {
        const response = await apiClient.post('/shipments', shipmentData);
        return response.data;
    },

    // Update shipment status
    updateStatus: async (id, status) => {
        const response = await apiClient.put(`/shipments/${id}/status`, { status });
        return response.data;
    }
};
