import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/utils/db';
import { withAdmin } from '@/utils/api-middleware';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid product ID' });
  }

  try {
    switch (req.method) {
      case 'PATCH': {
        const { featured, featuredOrder } = req.body;

        const product = await prisma.product.update({
          where: { id },
          data: { 
            featured,
            featuredOrder: featured ? featuredOrder : null
          },
        });

        return res.status(200).json(product);
      }
      default:
        return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in /api/products/featured/[id]:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export default withAdmin(handler);
