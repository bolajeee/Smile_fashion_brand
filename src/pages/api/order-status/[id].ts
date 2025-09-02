import { NextApiRequest, NextApiResponse } from 'next';
import { OrderStatus } from '@prisma/client';

function getId(req: NextApiRequest): string | null {
  const value = req.query[id];
  if (Array.isArray(value)) return value[0] ?? null;
  if (typeof value === 'string') return value;
  return null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // This route treats [id] as the enum value to validate or describe
  const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
  if (!id || typeof id !== 'string') return res.status(400).json({ message: 'Missing id' });

  if (req.method === 'GET') {
    const valid = Object.values(OrderStatus).includes(id as OrderStatus);
    return res.status(200).json({ value: id, valid });
  }

  return res.status(405).json({ message: 'Method not allowed' });
}