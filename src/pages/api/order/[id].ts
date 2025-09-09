import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/utils/db';

function getId(req: NextApiRequest): string | null {
  const value = req.query.id;
  if (Array.isArray(value)) return value[0] ?? null;
  if (typeof value === 'string') return value;
  return null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = getId(req);
  if (!id) return res.status(400).json({ message: 'Missing id' });

  try {
    switch (req.method) {
      case 'GET': {
        const order = await prisma.order.findUnique({
          where: { id },
          include: { items: true, user: true },
        });
        if (!order) return res.status(404).json({ message: 'Not found' });
        return res.status(200).json(order);
      }
      case 'PUT': {
        const { status, total, shippingAddress } = req.body || {};
        
        // Validate the status is a valid OrderStatus
        const validStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
        if (status && !validStatuses.includes(status)) {
          return res.status(400).json({ message: 'Invalid order status' });
        }

        const updateData: any = {};
        if (status) updateData.status = status;
        if (total) updateData.total = total;
        if (shippingAddress) updateData.shippingAddress = shippingAddress;

        const updated = await prisma.order.update({
          where: { id },
          data: updateData,
          include: { items: true, user: true },
        });
        return res.status(200).json(updated);
      }
      case 'DELETE': {
        await prisma.order.delete({ where: { id } });
        return res.status(200).json({ message: 'Order deleted successfully' });
      }
      default:
        return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error in /api/order/[id]:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}