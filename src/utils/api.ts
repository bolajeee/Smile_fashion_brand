import axios from 'axios';
import axiosRetry from 'axios-retry';
import { logger } from './logger';

// Create an axios instance with custom config
const api = axios.create({
  timeout: 10000, // 10 seconds
});

// Configure retry behavior
axiosRetry(api, {
  retries: 3,
  retryDelay: (retryCount) => {
    return retryCount * 1000; // exponential backoff
  },
  retryCondition: (error) => {
    // Retry on network errors or 5xx server errors
    return axiosRetry.isNetworkOrIdempotentRequestError(error) ||
      (error.response?.status ?? 0) >= 500;
  },
  onRetry: (retryCount, error, requestConfig) => {
    logger.warn(`Retrying failed request (attempt ${retryCount}/3)`, {
      url: requestConfig.url,
      method: requestConfig.method,
      error: error.message,
    });
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorContext = {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
    };

    // Log all errors
    logger.error('API request failed', error, errorContext);

    // If it's a critical error (not a validation error), send to Sentry
    if (!error.response || error.response.status >= 500) {
      logger.captureException(error, errorContext);
    }

    return Promise.reject(error);
  }
);

export { api };
