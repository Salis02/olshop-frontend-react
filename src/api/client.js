import axios from 'axios';

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    timeout: process.env.REACT_APP_API_TIMEOUT ? parseInt(process.env.REACT_APP_API_TIMEOUT, 10) : 10000,
    headers: {
        'Content-Type': 'application/json',
    },
})

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

apiClient.interceptors.response.use(
    (response) => {
        return response.data;
    },
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        const errorMessage = error.response?.data?.message || 'An unexpected error occurred';
        return Promise.reject(new Error(errorMessage));
    }
)

export default apiClient;