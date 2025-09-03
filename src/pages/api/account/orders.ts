import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '@/utils/db';
import type { Order } from '@/types/order';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Order[] | { message: string }>
) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    switch (req.method) {
      case 'GET': {
        const { userId } = req.query;

        if (userId !== session.user.id) {
          return res.status(403).json({ message: 'Forbidden' });
        }

        const orders = await prisma.order.findMany({
          where: { userId: userId as string },
          include: {
            items: {
              select: {
                id: true,
                productId: true,
                quantity: true,
                price: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        });
        
        const formattedOrders = orders.map(order => ({
      ...order,
      total: order.total.toNumber(),
      items: order.items.map(item => ({
        ...item,
        price: item.price.toNumber(),
      })),
    }));

    return res.status(200).json(formattedOrders as Order[]);
      }
      default:
        return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in /api/account/orders:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
