import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      const users = await prisma.user.findMany();
      return res.status(200).json(users);
    case 'POST':
      const user = await prisma.user.create({
        data: req.body,
      });
      return res.status(201).json(user);
    case 'PUT':
      const updatedUser = await prisma.user.update({
        where: { id: req.query.id },
        data: req.body,
      });
      return res.status(200).json(updatedUser);
    case 'DELETE':
      await prisma.user.delete({
        where: { id: req.query.id },
      });
      return res.status(200).json({ message: 'User deleted successfully' });
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}