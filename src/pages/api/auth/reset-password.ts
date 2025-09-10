import { sendEmail } from '@/lib/email';
import { templates } from '@/lib/emailTemplates';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, name, resetToken } = req.body;
    // TODO: Add password reset logic here (save token, etc)
    await sendEmail({
      to: email,
      subject: 'Reset your Smile Fashion password',
      html: templates.passwordReset ? templates.passwordReset({ name, email, resetToken }) : `<h2>Password Reset</h2><p>Hi ${name || email}, click <a href="${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}">here</a> to reset your password.</p>`
    });
    res.status(200).json({ success: true });
  } else {
    res.status(405).end();
  }
}
