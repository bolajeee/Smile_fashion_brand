import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/utils/db';
import { withAdmin } from '@/utils/api-middleware';

function getId(req: NextApiRequest): string | null {
  const value = req.query.id;
  if (Array.isArray(value)) return value[0] ?? null;
  if (typeof value === 'string') return value;
  return null;
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = getId(req);
  if (!id) return res.status(400).json({ message: 'Missing id' });

  try {
    switch (req.method) {
      case 'GET': {
        const product = await prisma.product.findUnique({ where: { id } });
        if (!product) return res.status(404).json({ message: 'Not found' });
        return res.status(200).json(product);
      }
      case 'PUT': {
        const { name, description, price, images, stock } = req.body || {};
        const updated = await prisma.product.update({
          where: { id },
          data: { name, description, price, images, stock },
        });
        return res.status(200).json(updated);
      }
      case 'DELETE': {
        await prisma.product.delete({ where: { id } });
        return res.status(200).json({ message: 'Product deleted successfully' });
      }
      default:
        return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error in /api/product/[id]:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// GET is public, but PUT/DELETE require admin
export default async function(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return handler(req, res);
  }
  return withAdmin(handler)(req, res);
}