import apiClient from "./client";

export const productImageApi = {
    // Upload product image
    upload: async (productUuid, formData) => {
        const response = await apiClient.post(`/products/${productUuid}/images`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Set primary image
    setPrimary: async (productUuid, imageId) => {
        const response = await apiClient.put(`/products/${productUuid}/images/${imageId}/set-primary`);
        return response.data;
    },

    // Remove image
    remove: async (productUuid, imageId) => {
        const response = await apiClient.delete(`/products/${productUuid}/images/${imageId}`);
        return response.data;
    }
};
