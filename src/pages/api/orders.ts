import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/utils/db';
import { withAuth } from '@/utils/api-middleware';
import { sendEmail } from '@/lib/email';
import { templates } from '@/lib/emailTemplates';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = ((req as unknown) as { user: { id: string; role: string } }).user;
  try {
    switch (req.method) {
      case 'GET': {
        // ...existing code...
        const orders = await prisma.order.findMany({
          where: user.role === 'ADMIN' ? undefined : { userId: user.id },
          include: { items: true, user: true },
        });
        return res.status(200).json(orders);
      }
      case 'POST': {
        const { total, shippingAddress, items } = req.body || {};
        if (total == null || !shippingAddress) {
          return res.status(400).json({ message: 'Missing required fields' });
        }
        const order = await prisma.order.create({
          data: {
            userId: user.id,
            status: 'PENDING',
            total,
            shippingAddress,
            items: items?.length
              ? {
                  create: items.map((item: { productId: string; quantity: number; price: number }) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price,
                  })),
                }
              : undefined,
          },
          include: { items: true, user: true },
        });

        // Send emails
        await sendEmail({
          to: order.user.email,
          subject: 'Your Order Confirmation',
          html: templates.orderConfirmation(order),
        });
        await sendEmail({
          to: process.env.ADMIN_EMAIL,
          subject: 'New Order Placed',
          html: templates.adminNewOrder(order),
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

export default withAuth(handler);