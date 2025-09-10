
import { Prisma } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/utils/db';
import { withAdmin } from '@/utils/api-middleware';
import { withCors } from '@/utils/cors';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    switch (req.method) {
      case 'GET': {
        const users = await prisma.user.findMany({
          // Exclude password hashes from the result
          select: {
            id: true,
            name: true,
            email: true,
            address: true,
            role: true,
            createdAt: true,
            updatedAt: true,
          },
        });
        return res.status(200).json(users);
      }
      case 'POST': {
        const { name, email, passwordHash, address } = req.body || {};
        if (!name || !email || !passwordHash) {
          return res.status(400).json({ message: 'Missing required fields' });
        }

        const user = await prisma.user.create({
          data: {
            name,
            email,
            passwordHash,
            address: address || '',
          },
        });

        // Exclude password hash from the response
        const { passwordHash: _, ...userWithoutPassword } = user;
        return res.status(201).json(userWithoutPassword);
      }
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle unique constraint violation (e.g., duplicate email)
      if (error.code === 'P2002') {
        const target = (error.meta?.target as string[]) || [];
        if (target.includes('email')) {
          return res
            .status(409)
            .json({ message: 'This email is already registered.' });
        }
        return res
          .status(409)
          .json({ message: `Duplicate value for: ${target.join(', ')}` });
      }
    }

    // eslint-disable-next-line no-console
    console.error('Error in /api/users:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Only allow GET for admins
// POST is public for registration
const wrappedHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    return withAdmin(handler)(req, res);
  }
  return handler(req, res);
};

export default withCors(wrappedHandler);