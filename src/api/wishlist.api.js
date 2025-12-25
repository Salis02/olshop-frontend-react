import apiClient from "./client";

export const wishlistApi = {
    // Get user's wishlist
    get: async () => {
        const response = await apiClient.get('/wishlist');
        return response.data;
    },

    // Add item to wishlist
    add: async (productId) => {
        const response = await apiClient.post('/wishlist', {
            product_id: productId
        });
        return response.data;
    },

    // Remove item from wishlist
    remove: async (productId) => {
        const response = await apiClient.delete(`/wishlist/${productId}`);
        return response.data;
    },

    // Check if product is in wishlist
    isInWishlist: async (productId, wishlistItems) => {
        if (!wishlistItems) return false;
        return wishlistItems.some(item => item.product_id === productId);
    }
};