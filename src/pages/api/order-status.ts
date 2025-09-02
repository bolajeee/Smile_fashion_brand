import { NextApiRequest, NextApiResponse } from 'next';
import { OrderStatus } from '@prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // This endpoint exposes available order statuses (enum values)
  if (req.method === 'GET') {
    return res.status(200).json(Object.values(OrderStatus));
  }
  return res.status(405).json({ message: 'Method not allowed' });
}