import * as Sentry from '@sentry/react';

export function initSentry() {
  Sentry.init({
    dsn: 'YOUR_SENTRY_DSN', // Replace with your Sentry DSN
    integrations: [
      Sentry.browserTracingIntegration(), // <-- This is the new way
    ],
    tracesSampleRate: 1.0,
    environment: process.env.NODE_ENV,
  });
} 