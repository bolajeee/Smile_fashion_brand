import { sendEmail } from '@/lib/email';
import { templates } from '@/lib/emailTemplates';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, name } = req.body;
    // TODO: Add user creation logic here
    await sendEmail({
      to: email,
      subject: 'Welcome to Smile Fashion! Confirm your email',
      html: templates.registrationWelcome ? templates.registrationWelcome({ name, email }) : `<h2>Welcome!</h2><p>Thank you for registering, ${name || email}!</p>`
    });
    res.status(200).json({ success: true });
  } else {
    res.status(405).end();
  }
}
