// Central API exports
export * from './authApi';
export * from './songsApi';

// API configuration
export const API_CONFIG = {
    BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
    TIMEOUT: 10000,
    RETRY_ATTEMPTS: 3,
};

// Common API utilities
export const apiUtils = {
    // Format error messages
    formatError: (error: any): string => {
        if (error?.response?.data?.message) {
            return error.response.data.message;
        }
        if (error?.message) {
            return error.message;
        }
        return 'An unexpected error occurred';
    },

    // Check if error is network related
    isNetworkError: (error: any): boolean => {
        return !error?.response && error?.code === 'NETWORK_ERROR';
    },

    // Retry logic for failed requests
    retry: async <T>(
        fn: () => Promise<T>,
        attempts: number = API_CONFIG.RETRY_ATTEMPTS
    ): Promise<T> => {
        try {
            return await fn();
        } catch (error) {
            if (attempts > 1 && apiUtils.isNetworkError(error)) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                return apiUtils.retry(fn, attempts - 1);
            }
            throw error;
        }
    },
};
