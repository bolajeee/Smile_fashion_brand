

import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { prisma } from '@/utils/db';
import { sendEmail } from '@/lib/email';
import bcrypt from 'bcryptjs';

// Removed unused 'templates' variable

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

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
        const { name, address, phoneNumber, image, email, currentPassword, newPassword } = req.body;

        // At least one field should be provided
        if (!name && !address && !phoneNumber && !image && !email && !newPassword) {
          return res.status(400).json({ message: 'No update data provided' });
        }

        // Fetch user
        const user = await prisma.user.findUnique({
          where: { id: session.user.id },
        });
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }

  const updateData: { name?: string; phoneNumber?: string; image?: string; address?: string; email?: string; passwordHash?: string } = {};
        let emailChanged = false;
        let passwordChanged = false;

        if (name) updateData.name = name;
        if (address) updateData.address = address;
        if (phoneNumber) updateData.phoneNumber = phoneNumber;
        if (image) updateData.image = image;

        // Handle email change
        if (email && email !== user.email) {
          // Check if email is unique
          const existing = await prisma.user.findUnique({ where: { email } });
          if (existing) {
            return res.status(400).json({ message: 'Email already in use' });
          }
          updateData.email = email;
          emailChanged = true;
        }

        // Handle password change
        if (newPassword) {
          if (!currentPassword) {
            return res.status(400).json({ message: 'Current password required' });
          }
          const valid = await bcrypt.compare(currentPassword, user.passwordHash);
          if (!valid) {
            return res.status(400).json({ message: 'Current password is incorrect' });
          }
          const hash = await bcrypt.hash(newPassword, 10);
          updateData.passwordHash = hash;
          passwordChanged = true;
        }

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

        // Send email notifications
        if (emailChanged) {
          await sendEmail({
            to: updated.email,
            subject: 'Your Smile Fashion email was changed',
            html: `<h2>Email Changed</h2><p>Your account email was changed to ${updated.email}.</p>`
          });
        }
        if (passwordChanged) {
          await sendEmail({
            to: updated.email,
            subject: 'Your Smile Fashion password was changed',
            html: `<h2>Password Changed</h2><p>Your account password was changed on ${new Date().toLocaleString()}.</p>`
          });
        }

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
