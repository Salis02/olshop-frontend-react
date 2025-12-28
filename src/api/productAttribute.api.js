import apiClient from "./client";

export const productAttributeApi = {
    // Get all attributes
    getAll: async (productUuid) => {
        const response = await apiClient.get(`/products/${productUuid}/attributes`);
        return response.data;
    },

    // Create attribute
    create: async (productUuid, attributeData) => {
        const response = await apiClient.post(`/products/${productUuid}/attributes`, attributeData);
        return response.data;
    },

    // Update attribute
    update: async (productUuid, attributeId, attributeData) => {
        const response = await apiClient.patch(`/products/${productUuid}/attributes/${attributeId}`, attributeData);
        return response.data;
    },

    // Remove attribute
    remove: async (productUuid, attributeId) => {
        const response = await apiClient.delete(`/products/${productUuid}/attributes/${attributeId}`);
        return response.data;
    }
};
