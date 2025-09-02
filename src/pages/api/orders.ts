import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/utils/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET': {
        const orders = await prisma.order.findMany({
          include: { items: true, user: true },
        });
        return res.status(200).json(orders);
      }
      case 'POST': {
        const { userId, status, total, shippingAddress, items } = req.body || {};
        if (!userId || total == null || !shippingAddress) {
          return res.status(400).json({ message: 'Missing required fields' });
        }
        const order = await prisma.order.create({
          data: {
            userId,
            status,
            total,
            shippingAddress,
            items: items?.length
              ? {
                create: items.map((it: any) => ({
                  productId: it.productId,
                  quantity: it.quantity,
                  price: it.price,
                })),
              }
              : undefined,
          },
          include: { items: true, user: true },
        });
        return res.status(201).json(order);
      }
      default:
        return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error in /api/orders:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}