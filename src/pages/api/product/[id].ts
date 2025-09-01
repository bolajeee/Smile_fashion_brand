import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.id;

  switch (req.method) {
    case 'GET':
      const product = await prisma.product.findUnique({
        where: { id },
      });
      return res.status(200).json(product);
    case 'PUT':
      const updatedProduct = await prisma.product.update({
        where: { id },
        data: req.body,
      });
      return res.status(200).json(updatedProduct);
    case 'DELETE':
      await prisma.product.delete({
        where: { id },
      });
      return res.status(200).json({ message: 'Product deleted successfully' });
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}