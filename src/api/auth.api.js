import apiClient from "./client";

export const authApi = {
    login: async (email, password) => {
        const response = await apiClient.post('/auth/login', { email, password });
        return response.data;
    },

    register: async (userData) => {
        const response = await apiClient.post('/auth/register', userData);
        return response.data;
    },

    logout: async () => {
        const response = await apiClient.post('/auth/logout');
        return response;
    },

    forgotPassword: async (email) => {
        const response = await apiClient.post('/auth/forgot-password', { email });
        return response;
    },

    resetPassword: async (token, newPassword) => {
        const response = await apiClient.post('/auth/reset-password', { token, newPassword });
        return response;
    }
}
