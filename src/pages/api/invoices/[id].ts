import { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from '@/utils/api-middleware';
import prisma from '@/lib/prisma';
import { generateInvoice } from '@/utils/invoice-generator';
import { OrderStatus } from '@/types/order';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const orderId = req.query.id as string;

    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required' });
    }

    // Get the order with its items
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true // Include product details to get the name
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Get the user's theme preference from the request cookies
    const theme = req.cookies['smile-theme'] || 'light';

    // Generate the PDF
    const buffer = await generateInvoice(
      {
        id: order.id,
        userId: order.userId,
        status: order.status as unknown as OrderStatus,
        total: Number(order.total),
        shippingAddress: order.shippingAddress,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        items: order.items.map(item => ({
          id: item.id,
          orderId: item.orderId,
          productId: item.productId,
          name: item.product.name,
          quantity: item.quantity,
          price: Number(item.price),
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
        }))
      },
      {
        darkMode: theme === 'dark'
      }
    );

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${orderId}.pdf`);
    
    // Send the PDF
    res.send(buffer);

  } catch (error) {
    console.error('Error generating invoice:', error);
    res.status(500).json({ message: 'Error generating invoice' });
  }
}

export default withAuth(handler);
