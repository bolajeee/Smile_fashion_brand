// src/utils/cors.ts
import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';

export type CorsOptions = {
  methods?: string[];
  origin?: string;
};

const DEFAULT_ORIGIN = 'https://smile-fashion.vercel.app';
const DEFAULT_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'];

export function withCors(
  handler: NextApiHandler,
  options: CorsOptions = {}
): NextApiHandler {
  const allowedOrigin = options.origin || DEFAULT_ORIGIN;
  const allowedMethods = (options.methods || DEFAULT_METHODS).join(', ');

  return async (req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    res.setHeader('Access-Control-Allow-Methods', allowedMethods);
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    return handler(req, res);
  };
}
