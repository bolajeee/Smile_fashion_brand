import { getToken } from 'next-auth/jwt';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import type { JWT } from 'next-auth/jwt';
import { ZodError } from 'zod';
import { logger } from './logger';

interface AuthenticatedRequest extends NextApiRequest {
  user: JWT;
}

export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 400,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export function withErrorHandler(handler: NextApiHandler) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    try {
      return await handler(req, res);
    } catch (error: any) {
      let statusCode = 500;
      let errorResponse: ApiError = {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred',
      };

      // Handle different types of errors
      if (error instanceof AppError) {
        statusCode = error.statusCode;
        errorResponse = {
          code: error.code,
          message: error.message,
          details: error.details,
        };
      } else if (error instanceof ZodError) {
        statusCode = 400;
        errorResponse = {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request data',
          details: error.errors,
        };
      }

      // Log the error
      logger.error('API Error:', error, {
        url: req.url,
        method: req.method,
        query: req.query,
        body: req.body,
        statusCode,
        errorResponse,
      });

      return res.status(statusCode).json(errorResponse);
    }
  };
}

export function withAuth(handler: NextApiHandler) {
  return withErrorHandler(async function (req: NextApiRequest, res: NextApiResponse) {
    const token = await getToken({ req });
    
    if (!token) {
      throw new AppError('UNAUTHORIZED', 'Authentication required', 401);
    }

    // Add user info to request
    (req as AuthenticatedRequest).user = token;
    
    return handler(req, res);
  });
}

export function withAdmin(handler: NextApiHandler) {
  return withErrorHandler(async function (req: NextApiRequest, res: NextApiResponse) {
    const token = await getToken({ req });
    
    if (!token) {
      throw new AppError('UNAUTHORIZED', 'Authentication required', 401);
    }

    if (token.role !== 'ADMIN') {
      throw new AppError('FORBIDDEN', 'Admin access required', 403);
    }

    // Add user info to request
    (req as AuthenticatedRequest).user = token;
    
    return handler(req, res);
  });
}

// Utility to combine multiple middleware
export function withMiddleware(...middleware: Array<(h: NextApiHandler) => NextApiHandler>) {
  return (handler: NextApiHandler): NextApiHandler =>
    middleware.reduceRight((h, m) => m(h), handler);
}
