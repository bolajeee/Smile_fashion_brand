import { prisma } from '@/utils/db';
import bcrypt from 'bcryptjs';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ error: 'Token and password are required' });

    // Debug log: incoming token and current time
    console.log('DEBUG: Incoming token:', token);
    console.log('DEBUG: Current UTC time:', new Date().toISOString());

    // Find user by token and check expiry
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gte: new Date() },
      },
    });
    console.log('DEBUG: Found user:', user);
    if (user) {
      console.log('DEBUG: User resetTokenExpiry:', user.resetTokenExpiry?.toISOString());
    }
    if (!user) return res.status(400).json({ error: 'Invalid or expired token' });

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password and clear token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    res.status(200).json({ success: true });
  } catch (err: any) {
    console.error('DEBUG: Error in verify-reset-token:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
