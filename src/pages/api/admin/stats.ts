import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/utils/db';
import { withAdmin } from '@/utils/api-middleware';

async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const [ordersCount, productsCount, usersCount, revenueAgg] = await Promise.all([
            prisma.order.count(),
            prisma.product.count(),
            prisma.user.count(),
            prisma.order.aggregate({ _sum: { total: true } }),
        ]);

        return res.status(200).json({
            totalOrders: ordersCount,
            totalProducts: productsCount,
            totalUsers: usersCount,
            totalRevenue: Number(revenueAgg._sum.total ?? 0),
        });
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error in /api/admin/stats:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export default withAdmin(handler);


