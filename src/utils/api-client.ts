import axios from 'axios';
import axiosRetry from 'axios-retry';
import * as Sentry from '@sentry/nextjs';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Configure retry behavior
axiosRetry(api, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    // Retry on network errors or 5xx server errors
    return axiosRetry.isNetworkOrIdempotentRequestError(error) || 
           (error.response?.status ? error.response.status >= 500 : false);
  },
  onRetry: (retryCount, error, requestConfig) => {
    Sentry.addBreadcrumb({
      category: 'api',
      message: `Retrying request (${retryCount}/3)`,
      level: 'warning',
      data: {
        url: requestConfig.url,
        method: requestConfig.method,
        error: error.message,
      },
    });
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    const errorResponse = {
      message: 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
      details: null,
    };

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      errorResponse.message = error.response.data?.message || error.response.statusText;
      errorResponse.code = error.response.data?.code || `HTTP_${error.response.status}`;
      errorResponse.details = error.response.data?.details;

      // Log to Sentry
      Sentry.captureException(error, {
        extra: {
          url: error.config.url,
          method: error.config.method,
          status: error.response.status,
          data: error.response.data,
        },
      });
    } else if (error.request) {
      // The request was made but no response was received
      errorResponse.message = 'No response received from server';
      errorResponse.code = 'NETWORK_ERROR';
      
      Sentry.captureException(error, {
        extra: {
          url: error.config.url,
          method: error.config.method,
        },
      });
    }

    return Promise.reject(errorResponse);
  }
);

export default api;
