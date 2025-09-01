import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      const orders = await prisma.order.findMany();
      return res.status(200).json(orders);
    case 'POST':
      const order = await prisma.order.create({
        data: req.body,
      });
      return res.status(201).json(order);
    case 'PUT':
      const updatedOrder = await prisma.order.update({
        where: { id: req.query.id },
        data: req.body,
      });
      return res.status(200).json(updatedOrder);
    case 'DELETE':
      await prisma.order.delete({
        where: { id: req.query.id },
      });
      return res.status(200).json({ message: 'Order deleted successfully' });
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}