import * as Sentry from '@sentry/nextjs';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  error?: Error;
}


class Logger {
  private static instance: Logger;
  private isProd = process.env.NODE_ENV === 'production';

  private constructor() {
    if (this.isProd) {
      Sentry.init({
        dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
        tracesSampleRate: 1.0,
        environment: process.env.NODE_ENV,
      });
    }
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatLogEntry(entry: LogEntry): string {
    const context = entry.context ? ` | context: ${JSON.stringify(entry.context)}` : '';
    const errorStack = entry.error ? ` | stack: ${entry.error.stack}` : '';
    return `[${entry.timestamp}] ${entry.level.toUpperCase()}: ${entry.message}${context}${errorStack}`;
  }

  private log(level: LogLevel, message: string, context?: Record<string, unknown>, error?: Error) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      error,
    };

    const formattedLog = this.formatLogEntry(entry);

    if (this.isProd) {
      // In production, we would send this to a logging service
      // For now, just console.log
      console[level](formattedLog);
    } else {
      // In development, use console with colors
      switch (level) {
        case 'error':
          console.error('\x1b[31m%s\x1b[0m', formattedLog);
          break;
        case 'warn':
          console.warn('\x1b[33m%s\x1b[0m', formattedLog);
          break;
        case 'info':
          console.info('\x1b[36m%s\x1b[0m', formattedLog);
          break;
        case 'debug':
          console.debug('\x1b[32m%s\x1b[0m', formattedLog);
          break;
      }
    }
  }

  info(message: string, context?: Record<string, unknown>) {
    this.log('info', message, context);
  }

  warn(message: string, context?: Record<string, unknown>) {
    this.log('warn', message, context);
  }

  error(message: string, error?: Error, context?: Record<string, unknown>) {
    this.log('error', message, context, error);
  }

  debug(message: string, context?: Record<string, unknown>) {
    if (!this.isProd) {
      this.log('debug', message, context);
    }
  }
}

export const logger = Logger.getInstance();
