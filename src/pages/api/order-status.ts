import { NextApiRequest, NextApiResponse } from 'next';
import { OrderStatus } from '@prisma/client';
import { withCors } from '@/utils/cors';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // This endpoint exposes available order statuses (enum values)
  if (req.method === 'GET') {
    return res.status(200).json(Object.values(OrderStatus));
  }
  return res.status(405).json({ message: 'Method not allowed' });
};

export default withCors(handler);