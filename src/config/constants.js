/**
 * Application Configuration Constants
 */

// API Configuration
export const API_CONFIG = {
    BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    TIMEOUT: process.env.REACT_APP_API_TIMEOUT ? parseInt(process.env.REACT_APP_API_TIMEOUT, 10) : 10000,
};

// Application Info
export const APP_INFO = {
    NAME: process.env.REACT_APP_NAME || 'SANS Store',
    VERSION: process.env.REACT_APP_VERSION || '1.0.0',
};

// Feature Flags
export const FEATURES = {
    ENABLE_ANALYTICS: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
    ENABLE_ERROR_TRACKING: process.env.REACT_APP_ENABLE_ERROR_TRACKING === 'true',
};

// Storage Keys
export const STORAGE_KEYS = {
    ACCESS_TOKEN: 'accessToken',
    USER: 'user',
    CART: 'cart',
    WISHLIST: 'wishlist',
};

// Route Paths
export const ROUTES = {
    HOME: '/',
    PRODUCTS: '/products',
    PRODUCT_DETAIL: '/products/:uuid',
    CATEGORIES: '/categories',
    CART: '/cart',
    WISHLIST: '/wishlist',
    LOGIN: '/login',
    REGISTER: '/register',
};

// Pagination
export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 12,
    PRODUCTS_PER_PAGE: 12,
};

// Validation Rules
export const VALIDATION = {
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PASSWORD_MIN_LENGTH: 8,
    PHONE_REGEX: /^[+]?[\d\s-()]+$/,
};

// Toast Configuration
export const TOAST_CONFIG = {
    POSITION: 'top-right',
    DURATION: {
        SUCCESS: 3000,
        ERROR: 4000,
        INFO: 3000,
    },
};

// HTTP Status Codes
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
};

export default {
    API_CONFIG,
    APP_INFO,
    FEATURES,
    STORAGE_KEYS,
    ROUTES,
    PAGINATION,
    VALIDATION,
    TOAST_CONFIG,
    HTTP_STATUS,
};
