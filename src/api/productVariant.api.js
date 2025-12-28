import apiClient from "./client";

export const productVariantApi = {
    // Get all variants
    getAll: async (productUuid) => {
        const response = await apiClient.get(`/products/${productUuid}/variants`);
        return response.data;
    },

    // Create variant
    create: async (productUuid, variantData) => {
        const response = await apiClient.post(`/products/${productUuid}/variants`, variantData);
        return response.data;
    },

    // Update variant
    update: async (productUuid, variantId, variantData) => {
        const response = await apiClient.patch(`/products/${productUuid}/variants/${variantId}`, variantData);
        return response.data;
    },

    // Remove variant
    remove: async (productUuid, variantId) => {
        const response = await apiClient.delete(`/products/${productUuid}/variants/${variantId}`);
        return response.data;
    }
};
