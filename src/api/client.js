import axios from 'axios';

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    timeout: process.env.REACT_APP_API_TIMEOUT ? parseInt(process.env.REACT_APP_API_TIMEOUT, 10) : 10000,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Request Interceptor
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Log requests in development
        if (process.env.NODE_ENV === 'development') {
            console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`, config.data || '');
        }

        return config;
    },
    (error) => {
        if (process.env.NODE_ENV === 'development') {
            console.error('[API Request Error]', error);
        }
        return Promise.reject(error);
    }
)

// Response Interceptor
apiClient.interceptors.response.use(
    (response) => {
        // Log successful responses in development
        if (process.env.NODE_ENV === 'development') {
            console.log(`[API Response] ${response.config.method.toUpperCase()} ${response.config.url}`, response.data);
        }
        return response.data;
    },
    async (error) => {
        const originalRequest = error.config;

        // Log errors in development
        if (process.env.NODE_ENV === 'development') {
            console.error('[API Error]', {
                url: error.config?.url,
                method: error.config?.method,
                status: error.response?.status,
                message: error.response?.data?.message || error.message
            });
        }

        // Handle 401 Unauthorized
        if (error.response?.status === 401) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');

            // Avoid redirect loop if already on login page
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
            return Promise.reject(new Error('Session expired. Please login again.'));
        }

        // Handle Network Errors
        if (!error.response) {
            if (error.code === 'ECONNABORTED') {
                return Promise.reject(new Error('Request timeout. Please check your internet connection.'));
            }
            if (error.message === 'Network Error') {
                return Promise.reject(new Error('Network error. Please check your internet connection.'));
            }
            return Promise.reject(new Error('Unable to connect to the server. Please try again later.'));
        }

        // Handle specific status codes
        let errorMessage = 'An unexpected error occurred';

        switch (error.response.status) {
            case 400:
                errorMessage = error.response.data?.message || 'Invalid request. Please check your input.';
                break;
            case 403:
                errorMessage = 'You do not have permission to perform this action.';
                break;
            case 404:
                errorMessage = error.response.data?.message || 'The requested resource was not found.';
                break;
            case 422:
                errorMessage = error.response.data?.message || 'Validation failed. Please check your input.';
                break;
            case 429:
                errorMessage = 'Too many requests. Please try again later.';
                break;
            case 500:
                errorMessage = 'Server error. Please try again later.';
                break;
            case 503:
                errorMessage = 'Service unavailable. Please try again later.';
                break;
            default:
                errorMessage = error.response.data?.message || `Error ${error.response.status}: ${error.message}`;
        }

        return Promise.reject(new Error(errorMessage));
    }
)

export default apiClient;
