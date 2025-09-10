import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/utils/db';
import { withAdmin } from '@/utils/api-middleware';
import { withCors } from '@/utils/cors';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET': {
        const products = await prisma.product.findMany({
          orderBy: [
            { featuredOrder: 'asc' },
            { createdAt: 'desc' }
          ],
        });
        return res.status(200).json(products);
      }
      case 'POST': {
        const { name, description, price, images, stock } = req.body || {};
        if (!name || !description || price == null || stock == null) {
          return res.status(400).json({ message: 'Missing required fields' });
        }
        const product = await prisma.product.create({
          data: { name, description, price, images, stock },
        });
        return res.status(201).json(product);
      }
      default:
        return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error in /api/products:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Only allow admins to create products, but allow public access to GET
const wrappedHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    return handler(req, res);
  }
  return withAdmin(handler)(req, res);
};

export default withCors(wrappedHandler);