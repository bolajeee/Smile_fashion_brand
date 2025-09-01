import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.id;

  switch (req.method) {
    case 'GET':
      const order = await prisma.order.findUnique({
        where: { id },
      });
      return res.status(200).json(order);
    case 'PUT':
      const updatedOrder = await prisma.order.update({
        where: { id },
        data: req.body,
      });
      return res.status(200).json(updatedOrder);
    case 'DELETE':
      await prisma.order.delete({
        where: { id },
      });
      return res.status(200).json({ message: 'Order deleted successfully' });
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}