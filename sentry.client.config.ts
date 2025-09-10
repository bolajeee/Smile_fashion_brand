// This file configures the initialization of Sentry on the client.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: process.env.NODE_ENV === 'development',

  // Configure environment
  environment: process.env.NODE_ENV,

  // Configure allowed domains for CORS
  allowUrls: [
    /https?:\/\/(www\.)?your-domain\.com/,
    // Add other domains as needed
  ],

  // Ignore specific errors
  ignoreErrors: [
    // Add patterns for errors you want to ignore
    'top.GLOBALS',
    'ResizeObserver loop limit exceeded',
  ],

  // Automatically instrument React components for better error tracking
  // (No manual integrations needed for Sentry v10+)
});
