import { getToken } from 'next-auth/jwt';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

export function withAuth(handler: NextApiHandler) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    try {
      const token = await getToken({ req });
      
      if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      // Add user info to request
      (req as any).user = token;
      
      return handler(req, res);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
}

export function withAdmin(handler: NextApiHandler) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    try {
      const token = await getToken({ req });
      
      if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      if (token.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Forbidden' });
      }

      // Add user info to request
      (req as any).user = token;
      
      return handler(req, res);
    } catch (error) {
      console.error('Admin middleware error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
}
