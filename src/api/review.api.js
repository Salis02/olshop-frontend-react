import apiClient from "./client";

export default reviewApi = {

    // Get product review
    getByProduct: async (product_id) => {
        const response = await apiClient.get(`/reviews/${product_id}`)
        return response.data
    },

    // Create review product
    createReview: async (reviewData) => {
        const response = await apiClient.post('/reviews', reviewData)
        return response.data
    },

    // Update review 
    updateReview: async (reviewData) => {
        const response = await apiClient.patch('/reviews', reviewData)
        return response.data
    }
}