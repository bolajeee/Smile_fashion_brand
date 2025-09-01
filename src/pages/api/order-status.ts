import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      const orderStatus = await prisma.orderStatus.findMany();
      return res.status(200).json(orderStatus);
    case 'POST':
      const newOrderStatus = await prisma.orderStatus.create({
        data: req.body,
      });
      return res.status(201).json(newOrderStatus);
    case 'PUT':
      const updatedOrderStatus = await prisma.orderStatus.update({
        where: { id: req.query.id },
        data: req.body,
      });
      return res.status(200).json(updatedOrderStatus);
    case 'DELETE':
      await prisma.orderStatus.delete({
        where: { id: req.query.id },
      });
      return res.status(200).json({ message: 'Order status deleted successfully' });
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}