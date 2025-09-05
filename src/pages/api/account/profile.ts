import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '@/utils/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    switch (req.method) {
      case 'GET': {
        const user = await prisma.user.findUnique({
          where: { id: session.user.id },
          select: {
            id: true,
            name: true,
            email: true,
            address: true,
            image: true,
            phoneNumber: true,
          },
        });

        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json(user);
      }
      case 'PUT': {
        const { name, address, phoneNumber, image } = req.body;

        // At least one field should be provided
        if (!name && !address && !phoneNumber && !image) {
          return res.status(400).json({ message: 'No update data provided' });
        }

        // Prepare update data with only provided fields
        const updateData: any = {};
        if (name) updateData.name = name;
        if (address) updateData.address = address;
        if (phoneNumber) updateData.phoneNumber = phoneNumber;
        if (image) updateData.image = image;

        const updated = await prisma.user.update({
          where: { id: session.user.id },
          data: updateData,
          select: {
            id: true,
            name: true,
            email: true,
            address: true,
            image: true,
            phoneNumber: true,
          },
        });

        return res.status(200).json(updated);
      }
      default:
        res.setHeader('Allow', ['GET', 'PUT']);
        return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in /api/account/profile:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
