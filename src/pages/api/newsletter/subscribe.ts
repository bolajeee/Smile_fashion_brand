import { sendEmail } from '@/lib/email';
import { templates } from '@/lib/emailTemplates';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email } = req.body;
    await sendEmail({
      to: email,
      subject: 'Welcome to Smile Fashion Newsletter!',
      html: templates.newsletterWelcome(email),
    });
    // Optionally notify admin
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: 'New Newsletter Subscriber',
      html: `<p>${email} just subscribed.</p>`,
    });
    res.status(200).json({ success: true });
  } else {
    res.status(405).end();
  }
}