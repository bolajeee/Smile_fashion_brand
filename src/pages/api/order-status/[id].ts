import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.id;

  switch (req.method) {
    case 'GET':
      const orderStatus = await prisma.orderStatus.findUnique({
        where: { id },
      });
      return res.status(200).json(orderStatus);
    case 'PUT':
      const updatedOrderStatus = await prisma.orderStatus.update({
        where: { id },
        data: req.body,
      });
      return res.status(200).json(updatedOrderStatus);
    case 'DELETE':
      await prisma.orderStatus.delete({
        where: { id },
      });
      return res.status(200).json({ message: 'Order status deleted successfully' });
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}