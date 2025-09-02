import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/utils/db';

function getId(req: NextApiRequest): string | null {
    const value = req.query.id;
    if (Array.isArray(value)) return value[0] ?? null;
    if (typeof value === 'string') return value;
    return null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const id = getId(req);
    if (!id) return res.status(400).json({ message: 'Missing id' });

    try {
        switch (req.method) {
            case 'GET': {
                const item = await prisma.orderItem.findUnique({ where: { id } });
                if (!item) return res.status(404).json({ message: 'Not found' });
                return res.status(200).json(item);
            }
            case 'PUT': {
                const { productId, orderId, quantity, price } = req.body || {};
                const updated = await prisma.orderItem.update({
                    where: { id },
                    data: { productId, orderId, quantity, price },
                });
                return res.status(200).json(updated);
            }
            case 'DELETE': {
                await prisma.orderItem.delete({ where: { id } });
                return res.status(200).json({ message: 'OrderItem deleted successfully' });
            }
            default:
                return res.status(405).json({ message: 'Method not allowed' });
        }
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error in /api/order-item/[id]:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


