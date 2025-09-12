import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/utils/db';
import { withAuth } from '@/utils/api-middleware';
import type { AuthenticatedRequest } from '@/utils/api-middleware';

function getId(req: NextApiRequest): string | null {
  const value = req.query.id;
  if (Array.isArray(value)) return value[0] ?? null;
  if (typeof value === 'string') return value;
  return null;
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = getId(req);
  if (!id) return res.status(400).json({ message: 'Missing id' });
  
  const reqUser = (req as AuthenticatedRequest).user;

  // User can only access their own data unless admin
  if (reqUser.role !== 'ADMIN' && id !== reqUser.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  try {
    switch (req.method) {
      case 'GET': {
        const user = await prisma.user.findUnique({
          where: { id },
          select: { id: true, name: true, email: true, address: true },
        });
        if (!user) return res.status(404).json({ message: 'Not found' });
        return res.status(200).json(user);
      }
      case 'PUT': {
        const { name, email, address, role } = req.body || {};
        // Only admin can update role
        let data: any = { name, email, address };
        if (typeof role !== 'undefined' && reqUser.role === 'ADMIN') {
          data.role = role;
        }
        const updated = await prisma.user.update({
          where: { id },
          data,
          select: { id: true, name: true, email: true, address: true, role: true },
        });
        return res.status(200).json(updated);
      }
      case 'DELETE': {
        await prisma.user.delete({ where: { id } });
        return res.status(200).json({ message: 'User deleted successfully' });
      }
      default:
        return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error in /api/user/[id]:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// All operations require auth
export default withAuth(handler);