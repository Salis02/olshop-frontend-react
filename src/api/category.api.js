import apiClient from './client'

export const categoryApi = {

    // Get all categories 
    getAll: async () => {
        const response = await apiClient.get('/categories')
        return response.data;
    },

    // Create category
    create: async (categories) => {
        const response = await apiClient.post('/categories', categories)
        return response.data
    },

    // Update category
    update: async (id, categories) => {
        const response = await apiClient.put(`/categories/${id}`, categories)
        return response.data
    },

    // Delete Category
    delete: async (id) => {
        const response = await apiClient.delete(`/categories/${id}`)
        return response.data
    }
}