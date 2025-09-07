import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/utils/db';
import { withAdmin } from '@/utils/api-middleware';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'PATCH': {
        const { orderedIds } = req.body;

        // Update all featured products' order in a transaction
        await prisma.$transaction(
          orderedIds.map(({ id, order }: { id: string; order: number }) =>
            prisma.product.update({
              where: { id },
              data: { featuredOrder: order },
            })
          )
        );

        return res.status(200).json({ message: 'Order updated successfully' });
      }
      default:
        return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in /api/products/featured/reorder:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export default withAdmin(handler);
