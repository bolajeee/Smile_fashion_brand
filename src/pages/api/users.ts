import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/utils/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET': {
        const users = await prisma.user.findMany({
          select: { id: true, name: true, email: true, address: true },
        });
        return res.status(200).json(users);
      }
      case 'POST': {
        const { name, email, passwordHash, address } = req.body || {};
        if (!name || !email || !passwordHash || !address) {
          return res.status(400).json({ message: 'Missing required fields' });
        }
        const user = await prisma.user.create({
          data: { name, email, passwordHash, address },
          select: { id: true, name: true, email: true, address: true },
        });
        return res.status(201).json(user);
      }
      default:
        return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error in /api/users:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}