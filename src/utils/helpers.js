/**
 * Format error messages for user display
 */
export const formatErrorMessage = (error) => {
    if (typeof error === 'string') {
        return error;
    }

    if (error?.message) {
        return error.message;
    }

    if (error?.response?.data?.message) {
        return error.response.data.message;
    }

    return 'An unexpected error occurred. Please try again.';
};

/**
 * Check if error is a network error
 */
export const isNetworkError = (error) => {
    return !error.response && (
        error.message === 'Network Error' ||
        error.code === 'ECONNABORTED' ||
        error.message?.includes('timeout')
    );
};

/**
 * Check if error is an authentication error
 */
export const isAuthError = (error) => {
    return error?.response?.status === 401 || error?.response?.status === 403;
};

/**
 * Check if error is a validation error
 */
export const isValidationError = (error) => {
    return error?.response?.status === 400 || error?.response?.status === 422;
};

/**
 * Log error to console in development, or to tracking service in production
 */
export const logError = (error, context = {}) => {
    if (process.env.NODE_ENV === 'development') {
        console.error('[Error]', { error, context, timestamp: new Date().toISOString() });
    } else if (process.env.REACT_APP_ENABLE_ERROR_TRACKING === 'true') {
        // In production, send to error tracking service
        // Example: Sentry.captureException(error, { extra: context });
    }
};

/**
 * Safe JSON parse with fallback
 */
export const safeJSONParse = (str, fallback = null) => {
    try {
        return JSON.parse(str);
    } catch (e) {
        return fallback;
    }
};

/**
 * Debounce function for search and other inputs
 */
export const debounce = (func, wait = 300) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};
