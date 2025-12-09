import apiClient from "./client";

export const productApi = {

    // Get all products with filters
    getAll : async(filters = {}) =>{
        const params = new URLSearchParams();

        if(filters.search) params.append('search', filters.search);
        if(filters.category_id) params.append('category_id', filters.category_id);
        if(filters.sort) params.append('sort', filters.sort);
        if(filters.order) params.append('order', filters.order);
        if(filters.page) params.append('page', filters.page);
        if(filters.limit) params.append('limit', filters.limit);
        if(filters.minPrice) params.append('minPrice', filters.minPrice);
        if(filters.maxPrice) params.append('maxPrice', filters.maxPrice);
        if(filters.rating) params.append('rating', filters.rating);

        const response = await apiClient.get(`/products?${params.toString()}`);
        return response.data;
    },

    // Get product by UUID
    getById : async(UUID) =>{
        const response = await apiClient.get(`/products/${UUID}`);
        return response.data;
    },

    // Get soft deleted products (admin only)
    getSoftDeleted : async() =>{
        const response = await apiClient.get('/products/soft-delete');
        return response.data;
    },

    // Create new product (admin only)
    create : async(productData) =>{
        const response = await apiClient.post('/products', productData);
        return response.data;
    },

    // Update product by UUID (admin only)
    updateById : async(UUID, productData) =>{
        const response = await apiClient.put(`/products/${UUID}`, productData);
        return response.data;
    },

    // Soft delete product by UUID (admin only)
    softDeleteById : async(UUID) =>{
        const response = await apiClient.delete(`/products/${UUID}`);
        return response.data;
    },

    // Restore soft deleted product by UUID (admin only)
    restoreById : async(UUID) =>{
        const response = await apiClient.patch(`/products/restore/${UUID}`);
        return response.data;
    },
}