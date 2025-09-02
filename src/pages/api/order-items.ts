import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/utils/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        switch (req.method) {
            case 'GET': {
                const items = await prisma.orderItem.findMany();
                return res.status(200).json(items);
            }
            case 'POST': {
                const { productId, orderId, quantity, price } = req.body || {};
                if (!productId || !orderId || quantity == null || price == null) {
                    return res.status(400).json({ message: 'Missing required fields' });
                }
                const item = await prisma.orderItem.create({
                    data: { productId, orderId, quantity, price },
                });
                return res.status(201).json(item);
            }
            default:
                return res.status(405).json({ message: 'Method not allowed' });
        }
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error in /api/order-items:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


