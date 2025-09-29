import { prisma } from '@/utils/db';
import { sendEmail } from '@/lib/email';
import { templates } from '@/lib/emailTemplates';
import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ error: 'User not found' });

  // Generate secure token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 3 * 60 * 60 * 1000); // 3 hours from now
    // Debug log for token
    console.log('DEBUG: Generated resetToken:', resetToken);

  // Save token and expiry to user
  await prisma.user.update({
    where: { email },
    data: {
      resetToken,c 
      resetTokenExpiry: expires,
    },
  });

  // Send email
  await sendEmail({
    to: email,
    subject: 'Reset your Smile Fashion password',
    html: templates.passwordReset({ name: user.name, email, resetToken }),
  });

  res.status(200).json({ success: true });
}
