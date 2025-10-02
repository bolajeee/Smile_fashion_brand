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

  try {
    await sendEmail({
      to: email,
      subject: 'Thanks for connecting with Smile Fashion!',
      html: `<h2>Thanks for connecting!</h2><p>You are now subscribed to Smile Fashion updates. Stay tuned for the latest drops, style tips, and exclusive deals.</p>`
    });
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
