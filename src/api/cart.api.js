import apiCLient from './client'

export const cartApi = {

    // Get user's cart
    get: async () => {
        const response = await apiCLient.get('/cart')
        return response.data
    },

    // Add Product to cart
    addItem: async (item) => {
        const response = await apiCLient.post('/cart', item)
        return response.data
    },

    // Update product cart
    updateItem: async (itemId, quantity) => {
        const response = await apiCLient.put(`/cart/${itemId}`, { quantity })
        return response.data
    },

    // Remove product from cart
    removeItem: async (itemId) => {
        const response = await apiCLient.delete(`/cart/${itemId}`)
        return response.data
    },

    // Clear entire cart
    clear: async () => {
        const response = await apiCLient.delete('/delete')
        return response.data
    }
}