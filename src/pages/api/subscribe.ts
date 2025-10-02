import type { NextApiRequest, NextApiResponse } from 'next';
import { sendEmail } from '@/lib/email';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  // Generate a unique code for the user
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();

  try {
    await sendEmail({
      to: email,
      subject: 'Welcome to Style Squad! Your 15% Off Code',
      html: `<h2>Welcome to the Style Squad!</h2><p>Here is your exclusive 15% off code:</p><h3 style='color:#22c55e;'>${code}</h3><p>Use it at checkout to save on your first order.</p>`
    });
    return res.status(200).json({ success: true, code });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
