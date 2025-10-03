import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/utils/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const products = await prisma.product.findMany({
      take: 8, // Limit to 8 featured products
      where: {
        stock: {
          gt: 0 // Only show in-stock items
        }
      },
      orderBy: {
        createdAt: 'desc' // Show newest products first
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        images: true,
        stock: true,
        type: true,
        featured: true,
        featuredOrder: true,
        reviews: true,
      }
    });
    
    return res.status(200).json(products);
  } catch (error) {
    console.error('Error in /api/products/featured:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ message: 'Internal server error', error: errorMessage });
  }
}
