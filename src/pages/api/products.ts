import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/utils/db';
import { withAdmin } from '@/utils/api-middleware';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET': {
        const products = await prisma.product.findMany();
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

// Only allow admins to create products
export default withAdmin(handler);