import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.id;

  switch (req.method) {
    case 'GET':
      const user = await prisma.user.findUnique({
        where: { id },
      });
      return res.status(200).json(user);
    case 'PUT':
      const updatedUser = await prisma.user.update({
        where: { id },
        data: req.body,
      });
      return res.status(200).json(updatedUser);
    case 'DELETE':
      await prisma.user.delete({
        where: { id },
      });
      return res.status(200).json({ message: 'User deleted successfully' });
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}